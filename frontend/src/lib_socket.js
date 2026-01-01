import { io } from 'socket.io-client';
let socket = null;
export function createSocket(token, url){
  if(socket) socket.disconnect();
  if(!token) return null;
  socket = io(url || process.env.NEXT_PUBLIC_SOCKET_URL || '/', { auth: { token } });
  return socket;
}
export function getSocket(){ return socket; }
