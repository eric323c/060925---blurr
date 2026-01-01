import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: any) {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const j = await res.json();
    if (res.ok) {
      setMsg('Registered. You can now login.');
      setTimeout(() => (window.location.href = '/login'), 800);
    } else {
      setMsg(j.error || 'Registration failed');
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Register</button>
      </form>
      <div>{msg}</div>
    </main>
  );
}
