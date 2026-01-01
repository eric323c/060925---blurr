import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../lib_apiClient';

const AuthContext = createContext();

export function AuthProvider({children}){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const t = typeof window !== 'undefined' ? localStorage.getItem('wink_token') : null;
    if(!t){ setLoading(false); return; }
    (async ()=>{
      try{
        const res = await apiFetch('/api/auth/me', {headers:{Authorization:'Bearer '+t}});
        if(res && res.user) setUser(res.user);
      }catch(e){ console.error('me fetch error', e); }
      setLoading(false);
    })();
  },[]);

  async function login(username,password){
    const res = await fetch('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password})});
    const data = await res.json();
    if(data.token){ localStorage.setItem('wink_token', data.token); setUser(data.user); }
    return data;
  }
  async function register(username,password,displayName){
    const res = await fetch('/api/auth/register', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password,displayName})});
    const data = await res.json();
    if(data.token){ localStorage.setItem('wink_token', data.token); setUser(data.user); }
    return data;
  }
  function logout(){ localStorage.removeItem('wink_token'); setUser(null); }

  return <AuthContext.Provider value={{user, loading, login, register, logout}}>{children}</AuthContext.Provider>
}

export function useAuth(){ return useContext(AuthContext); }
