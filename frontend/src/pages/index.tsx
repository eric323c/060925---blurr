import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <>
      <Head>
        <title>Blurr - Private Messaging</title>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>Welcome to Blurr</h1>
        <p className={styles.tagline}>Connect privately and instantly.</p>
        <button className={styles.cta}>Get Started</button>
      </main>
    </>
  );
};

export default Home;
