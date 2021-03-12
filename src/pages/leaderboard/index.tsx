import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/client';

import api from '../../utils/api';
import ScoreList from '../../components/ScoreList';
import Sidebar from '../../components/Sidebar';

import { ChallengeResponse } from '../api/challenge';

import styles from '../../styles/pages/Leaderboard.module.css';

interface LeaderboardProps {
  challenges: ChallengeResponse[];
}
const Leaderboard: NextPage<LeaderboardProps> = ({ challenges }) => {
  return (
    <main className={styles.main}>
      <Head>
        <title>Leaderboard | move.it</title>
      </Head>
      <Sidebar />
      <div className={styles.container}>
        <h1>Leaderboard</h1>
        <ScoreList challenges={challenges} />
      </div>
    </main>
  );
};

export default Leaderboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;

  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return {
      props: {},
    };
  }

  try {
    const { 'next-auth.session-token': sessionToken } = req.cookies;

    const response = await api.get<ChallengeResponse[]>('/api/challenge', {
      headers: {
        cookie: `next-auth.session-token=${sessionToken} `,
      },
    });

    const challenges = response.data;
    return {
      props: {
        challenges,
      },
    };
  } catch (error) {
    return {
      props: {
        challenges: [],
      },
    };
  }
};
