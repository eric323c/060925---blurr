import React, { createContext, useContext, useEffect, useState } from 'react';
import { createSocket, getSocket } from '../lib_socket';
import { useAuth } from './context_Auth';

const SocketContext = createContext();
export function SocketProvider({children}){
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(()=>{
    const t = typeof window !== 'undefined' ? localStorage.getItem('wink_token') : null;
    const s = createSocket(t, process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');
    setSocket(s);
    function onErr(e){ console.warn('socket error', e); }
    if(s){ s.on('connect_error', onErr); }
    return ()=>{ if(s){ s.off('connect_error', onErr); s.disconnect(); } }
  },[user]);

  return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}
export function useSocket(){ return useContext(SocketContext); }
