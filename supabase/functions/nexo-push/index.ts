import webpush from "npm:web-push@3.6.7";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-nexo-push-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

async function rest(url: string, key: string, path: string, init: RequestInit = {}) {
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(init.headers || {}),
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  try {
    const configuredSecret = Deno.env.get("NEXO_PUSH_SECRET") || "";
    const suppliedSecret = req.headers.get("x-nexo-push-secret") || "";
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const suppliedAuth = req.headers.get("authorization") || "";
    const authorized = (configuredSecret && suppliedSecret === configuredSecret) || (service && suppliedAuth === `Bearer ${service}`);

    if (!authorized) return json({ error: "No autorizado" }, 401);

    const url = Deno.env.get("SUPABASE_URL") || "";
    const restKey = service;
    const pub = Deno.env.get("VAPID_PUBLIC_KEY") || "";
    const priv = Deno.env.get("VAPID_PRIVATE_KEY") || "";
    const subject = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@nexoplay.local";

    if (!url || !restKey) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
    if (!pub || !priv) throw new Error("Faltan VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY.");

    const body = await req.json();
    const record = body?.record || body || {};
    const userIds: string[] = [];

    if (record?.audience === "admin") {
      const admins = await rest(url, restKey, "profiles?select=id&role=eq.admin");
      if (admins.ok) {
        const rows = await admins.json();
        if (Array.isArray(rows)) rows.forEach((r: any) => r?.id && userIds.push(String(r.id)));
      }
    } else if (record?.user_id) {
      userIds.push(String(record.user_id));
    }

    const uniqueIds = [...new Set(userIds)];
    if (!uniqueIds.length) return json({ ok: true, sent: 0, total: 0 });

    const q = uniqueIds.map(encodeURIComponent).join(",");
    const subs = await rest(url, restKey, `nexoplay_push_subscriptions?select=id,user_id,endpoint,subscription&user_id=in.(${q})`);
    if (!subs.ok) throw new Error(await subs.text());

    const rows = await subs.json();
    webpush.setVapidDetails(subject, pub, priv);

    const payload = JSON.stringify({
      title: String(record?.title || "NexoPlay 🔔"),
      body: String(record?.message || "Tienes una nueva actualización."),
      url: String(record?.data?.url || "./index.html"),
      tag: String(record?.type || "nexoplay"),
    });

    const results = await Promise.allSettled(
      (Array.isArray(rows) ? rows : []).map(async (row: any) => {
        try {
          await webpush.sendNotification(row.subscription, payload);
          return { ok: true };
        } catch (error: any) {
          const status = Number(error?.statusCode || 0);
          if (status === 404 || status === 410) {
            await rest(url, restKey, `nexoplay_push_subscriptions?id=eq.${encodeURIComponent(row.id)}`, { method: "DELETE" });
          }
          throw error;
        }
      }),
    );

    return json({
      ok: true,
      sent: results.filter((x) => x.status === "fulfilled").length,
      total: results.length,
    });
  } catch (error) {
    console.error("Nexo push error:", error);
    return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
