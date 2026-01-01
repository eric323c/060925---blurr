import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: any) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const j = await res.json();
    if (res.ok && j.token) {
      localStorage.setItem('wink_token', j.token);
      setMsg('Logged in');
      window.location.href = '/';
    } else {
      setMsg(j.error || 'Login failed');
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
      </form>
      <div>{msg}</div>
    </main>
  );
}
