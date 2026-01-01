export async function apiFetch(path, opts={}){
  const headers = opts.headers||{};
  if(typeof window !== 'undefined'){
    const t = localStorage.getItem('wink_token');
    if(t) headers['Authorization'] = 'Bearer '+t;
  }
  const res = await fetch(path, {...opts, headers});
  const text = await res.text();
  try{ return JSON.parse(text); }catch(e){ return text; }
}
