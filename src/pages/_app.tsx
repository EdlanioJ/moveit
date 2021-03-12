import { NextPage } from 'next';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../styles/globals.css';
import { Provider as NextAuthProvider } from 'next-auth/client';

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Component {...pageProps} />
    </NextAuthProvider>
  );
};

export default MyApp;
