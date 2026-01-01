import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

type User = {
  id: number;
  name: string;
  age: number;
  distance: string;
  winks: number;
  color: string;
};

const initialUsers: User[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: ['Alex', 'Sam', 'Riley', 'Jordan', 'Taylor', 'Casey', 'Drew', 'Peyton', 'Avery', 'Morgan', 'Sky', 'Quinn'][i % 12],
  age: 20 + (i % 10),
  distance: `${100 + i * 5}m`,
  winks: 0,
  color: ['#FF6B6B', '#FDBA74', '#FFD166', '#06D6A0', '#4D96FF', '#9B5DE5'][i % 6],
}));

export default function Home() {
  const [started, setStarted] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [lastWink, setLastWink] = useState<number | null>(null);

  useEffect(() => {
    // small demo: rotate a fake presence status every few seconds
    const t = setInterval(() => {
      setUsers((u) => u.map((x) => ({ ...x })));
    }, 10000);
    return () => clearInterval(t);
  }, []);

  function handleWink(id: number) {
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, winks: x.winks + 1 } : x)));
    setLastWink(id);
    setTimeout(() => setLastWink(null), 700);
  }

  return (
    <>
      <Head>
        <title>Wink - Private Messaging</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main className={styles.container}>
        {!started ? (
          <div className={styles.landing}>
            <h1 className={styles.title}>Welcome to Wink</h1>
            <p className={styles.tagline}>Tap to connect privately and instantly.</p>
            <button className={styles.cta} onClick={() => setStarted(true)}>
              Get Started
            </button>
          </div>
        ) : (
          <div className={styles.app}>
            <header className={styles.header}>
              <h2>People Nearby</h2>
              <div>
                <button className={styles.secondary} onClick={() => setStarted(false)}>
                  Back
                </button>
              </div>
            </header>

            <div className={styles.grid}>
              {users.map((user) => (
                <div key={user.id} className={styles.card}>
                  <div className={styles.avatar} style={{ background: user.color }}>
                    {user.name[0]}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.name}>{user.name}, {user.age}</div>
                    <div className={styles.meta}>{user.distance}</div>
                  </div>
                  <button
                    className={`${styles.winkBtn} ${lastWink === user.id ? styles.winkAnim : ''}`}
                    onClick={() => handleWink(user.id)}
                    aria-label={`Wink at ${user.name}`}
                  >
                    {user.winks > 0 ? `Winked (${user.winks})` : 'Wink'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
