import React from 'react'
import { AuthProvider } from '../context_Auth'
import { SocketProvider } from '../context_Socket'

export default function MyApp({Component, pageProps}){
  return (
    <AuthProvider>
      <SocketProvider>
      <Component {...pageProps} />
          </SocketProvider>
    </AuthProvider>
  )
}
