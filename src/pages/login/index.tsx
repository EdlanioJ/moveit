import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { getSession, signIn } from 'next-auth/client';
import styles from '../../styles/pages/Login.module.css';

const Login: NextPage = () => {
  return (
    <div className={styles.overlay}>
      <Head>
        <title>Login | move.it</title>
      </Head>
      <div className={styles.container}>
        <section>
          <div>
            <img src="logo-full-light.svg" alt="Move It" />
            <h1>Bem-vindo</h1>
            <p>Faça o login para começar</p>
            <button type="button" onClick={() => signIn('google')}>
              <img src="/icons/google.svg" alt="Github" />
              Entrar com Google
            </button>

            <button type="button" onClick={() => signIn('github')}>
              <img src="/icons/github.svg" alt="Github" />
              Entrar com Github
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;

  const session = await getSession({ req });

  if (!!session) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return {
      props: {},
    };
  }

  return { props: {} };
};

export default Login;
