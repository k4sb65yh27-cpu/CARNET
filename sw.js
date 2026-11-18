const V='carnet-v1.18.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const q=e.request;
  if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
  e.respondWith(
    fetch(q,{cache:'no-cache'}).then(r=>{
      // seules les réponses 200 du site sont mises en cache : une page de connexion ou une erreur ne remplace jamais un fichier
      if(r.ok&&r.type==='basic'){const c=r.clone();caches.open(V).then(x=>x.put(q,c))}
      return r})
      .catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||(q.mode==='navigate'?caches.match('./index.html'):Response.error())))
  );
});
