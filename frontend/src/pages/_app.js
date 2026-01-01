import React from 'react'
import { AuthProvider } from '../context_Auth'

export default function MyApp({Component, pageProps}){
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
