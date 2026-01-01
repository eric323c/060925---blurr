import React, {useEffect, useState} from 'react'
import { useAuth } from '../context_Auth'
import { createSocket, getSocket } from '../lib_socket'

export default function Home(){
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try{ const r = await fetch('/api/users'); const j = await r.json(); setUsers(j.users||[]); }catch(e){}
    })();
  },[]);

  useEffect(()=>{
    const t = typeof window !== 'undefined' ? localStorage.getItem('wink_token') : null;
    const s = createSocket(t, process.env.NEXT_PUBLIC_SOCKET_URL || '');
    if(!s) return;
    s.on('connect', ()=>console.log('socket connected', s.id));
    s.on('wink', data => console.log('wink', data));
    return ()=>{ if(s) s.disconnect(); }
  },[user]);

  function sendWink(toId){
    const s = getSocket();
    if(!s) return alert('not connected');
    s.emit('wink', { toId });
  }

  return (
    <main style={{padding:20}}>
      <h1>Wink</h1>
      {loading ? <div>Loading...</div> : user ? <div>Welcome {user.displayName}</div> : <div><a href="/login">Login</a> | <a href="/register">Register</a></div>}
      <h2>Nearby</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {users.map(u=> (
          <div key={u.id} style={{border:'1px solid #ccc',padding:10}}>
            <div>{u.displayName}</div>
            <button onClick={()=>sendWink(u.id)}>Wink</button>
          </div>
        ))}
      </div>
    </main>
  )
}
