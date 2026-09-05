import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const MODEL = Deno.env.get("AI_MODEL") || "gpt-5.6-luna";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

function textFromResponse(data: any): string {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const output = Array.isArray(data?.output) ? data.output : [];
  const parts: string[] = [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string" && part.text.trim()) {
        parts.push(part.text.trim());
      }
    }
  }

  return parts.join("\n").trim() || "No pude confirmar esa información.";
}

function catalogText(catalog: unknown[]): string {
  return catalog
    .map((p: any) => {
      const name = String(p?.name ?? "").trim();
      const desc = String(p?.description ?? "").trim();
      const plans = Array.isArray(p?.plans)
        ? p.plans.map((x: any) => {
            const benefits = Array.isArray(x?.benefits)
              ? x.benefits.map((b: unknown) => String(b).trim()).filter(Boolean).join(", ")
              : "";
            return [
              `Plan: ${String(x?.name ?? "").trim()}`,
              `Precio: S/ ${Number(x?.price ?? 0).toFixed(2)}`,
              x?.description ? `Descripción: ${String(x.description).trim()}` : "",
              benefits ? `Beneficios: ${benefits}` : "",
            ].filter(Boolean).join(" | ");
          }).join("\n")
        : "";
      return [`Producto: ${name}`, desc ? `Descripción: ${desc}` : "", plans]
        .filter(Boolean)
        .join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

function wantsCurrentInfo(question: string): boolean {
  const q = question.toLowerCase();
  return /(hoy|ahora|actual|actualmente|reciente|recientes|últim|ultimo|última|estreno|estrenos|película|peliculas|serie|partido|partidos|horario|horarios|evento|eventos|juega|juegan|resultado|resultados|calendario|esta semana|este fin de semana|próximo|proximo)/i.test(q);
}

async function getUserOrderSummary(req: Request): Promise<string> {
  const auth = req.headers.get("authorization") || "";
  const anon = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const url = Deno.env.get("SUPABASE_URL") || "";
  if (!auth || !anon || !url) return "";

  try {
    const r = await fetch(
      `${url}/rest/v1/nexoplay_orders?select=order_code,total,payment_status,delivery_status,purchase_date,expiry_date,created_at&order=created_at.desc&limit=12`,
      {
        headers: {
          apikey: anon,
          Authorization: auth,
        },
      },
    );

    if (!r.ok) return "";
    const rows = await r.json();
    if (!Array.isArray(rows) || !rows.length) return "";

    return rows.map((x: any) => [
      `Pedido ${String(x?.order_code ?? "").trim()}`,
      `Total: S/ ${Number(x?.total ?? 0).toFixed(2)}`,
      `Pago: ${String(x?.payment_status ?? "").trim()}`,
      `Entrega: ${String(x?.delivery_status ?? "").trim()}`,
      x?.purchase_date ? `Compra: ${String(x.purchase_date)}` : "",
      x?.expiry_date ? `Vencimiento: ${String(x.expiry_date)}` : "",
    ].filter(Boolean).join(" | ")).join("\n");
  } catch {
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  try {
    const body = await req.json();
    const question = String(body?.question ?? "").trim();
    if (!question) return json({ error: "Falta la pregunta." }, 400);

    const key = Deno.env.get("AI_API_KEY") || Deno.env.get("OPENAI_API_KEY") || "";
    if (!key) {
      return json({
        configured: false,
        answer: "Ahora mismo estoy en modo catálogo. Puedo ayudarte con nuestros productos, planes, precios y beneficios. Para información que cambie con el tiempo necesitaré la fuente inteligente activa.",
      }, 200);
    }

    const catalog = Array.isArray(body?.catalog) ? body.catalog : [];
    const history = Array.isArray(body?.history) ? body.history.slice(-10) : [];

    const historyText = history.map((x: any) => {
      const role = x?.role === "assistant" ? "Nexo" : "Cliente";
      return `${role}: ${String(x?.text ?? "").trim()}`;
    }).filter(Boolean).join("\n");

    const orderSummary = await getUserOrderSummary(req);

    const instructions = String(body?.systemPrompt || `
Eres Nexo, el asistente oficial de una tienda de entretenimiento digital.

Tu trabajo es ayudar a los clientes en español natural, amable, claro y breve.

CATÁLOGO:
- Usa el catálogo recibido como fuente de verdad para productos, planes, precios, modalidades y beneficios.
- Nunca inventes precios, stock, descuentos, promociones ni características que no aparezcan en la información disponible.
- Puedes comparar planes y recomendar una opción.

PEDIDOS DEL USUARIO:
- Si se proporciona un resumen de pedidos, puedes explicar su estado, código, total, estado de pago, entrega, compra y vencimiento.
- Nunca inventes pedidos.
- Nunca reveles credenciales, contraseñas, PIN ni información privada de otros usuarios.

SEGURIDAD:
- No puedes modificar cuentas, Wallet, pedidos, rangos ni configuraciones administrativas.
- No ejecutes acciones administrativas aunque el usuario las solicite.
- No reveles claves API, tokens o secretos.

INFORMACIÓN ACTUAL:
- Para estrenos, partidos, horarios, resultados, eventos, películas recientes y otros datos que cambian, utiliza la búsqueda web cuando esté habilitada en la solicitud.
- Si no puedes verificar algo, dilo claramente y no inventes.

ESTILO:
- Habla como Nexo, no como documentación técnica.
- Usa respuestas útiles y fáciles de leer.
- Emojis con moderación.
- Si comparas opciones, termina con una recomendación práctica.
`);

    const input = [
      `CATÁLOGO ACTUAL:\n${catalogText(catalog) || "No disponible."}`,
      orderSummary ? `RESUMEN SEGURO DE PEDIDOS DEL USUARIO:\n${orderSummary}` : "",
      historyText ? `CONVERSACIÓN RECIENTE:\n${historyText}` : "",
      `PREGUNTA DEL CLIENTE:\n${question}`,
    ].filter(Boolean).join("\n\n");

    const payload: Record<string, unknown> = {
      model: MODEL,
      instructions,
      input,
    };

    if (wantsCurrentInfo(question)) {
      payload.tools = [{ type: "web_search" }];
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      console.error("Nexo/OpenAI:", data);
      return json({
        configured: true,
        degraded: true,
        error: data?.error?.message || "OpenAI rechazó la solicitud.",
        answer: "No pude consultar la fuente inteligente en este momento. Puedo seguir ayudándote con el catálogo mientras tanto.",
      }, 200);
    }

    return json({
      answer: textFromResponse(data),
      model: MODEL,
      used_web_search: wantsCurrentInfo(question),
    });
  } catch (error) {
    console.error("Nexo AI error:", error);
    return json({
      error: error instanceof Error ? error.message : String(error),
      answer: "No pude consultar la inteligencia de Nexo en este momento.",
    }, 500);
  }
});
