import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const required = [
  'index.html','sw.js','manifest.webmanifest','favicon.svg',
  'js/legacy-runtime.js','js/nexoplay-v13.js','js/nexoplay-v15.js','js/nexo-config.js',
  'css/nexoplay-v17-final.css','supabase/config.toml',
  'supabase/functions/nexo-ai/index.ts','supabase/functions/nexo-push/index.ts'
];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Falta archivo requerido: ${rel}`);
}

const files = [];
function walk(dir){
  for (const name of fs.readdirSync(dir)) {
    const full=path.join(dir,name);
    const st=fs.statSync(full);
    if(st.isDirectory()) walk(full); else files.push(full);
  }
}
walk(root);

const missing = [];
const assetRe = /(?:src|href|url)\s*=\s*(["'])(.*?)\1|url\(\s*(["']?)([^)"']+)\3\s*\)/gi;
for (const file of files.filter(f => /\.(html|css|js)$/i.test(f))) {
  const text=fs.readFileSync(file,'utf8');
  for (const m of text.matchAll(assetRe)) {
    const ref=m[2] ?? m[4] ?? '';
    if(!ref || /^(https?:|data:|mailto:|javascript:|#|blob:|\/\/)/i.test(ref)) continue;
    const clean=ref.split('?')[0].split('#')[0].trim();
    if(!clean || !/\.(css|js|html|svg|webmanifest|png|jpg|jpeg|webp|ico|txt|json)$/i.test(clean)) continue;
    const resolved=path.resolve(path.dirname(file),clean);
    if(!fs.existsSync(resolved)) missing.push(`${path.relative(root,file)} -> ${ref}`);
  }
}
if(missing.length){
  console.error('Referencias locales no resueltas:');
  for(const x of missing) console.error(' - '+x);
  process.exit(1);
}

for (const file of files.filter(f => /\.js$/i.test(f) && !f.includes(`${path.sep}node_modules${path.sep}`))) {
  execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
}
console.log('OK - estructura, recursos y JavaScript comprobados.');
