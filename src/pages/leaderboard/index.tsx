import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/client';

import ScoreList from '../../components/ScoreList';
import Sidebar from '../../components/Sidebar';

import styles from '../../styles/pages/Leaderboard.module.css';
import Challenge from '../../models/challenge';
import dbConnect from '../../utils/dbConnect';
import { ChallengeResponse } from '../api/challenge/[id]';

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
    await dbConnect();
    const challengesDoc = await Challenge.find({}, null, {
      sort: { totalExperience: 'desc' },
      populate: 'user',
    });

    const challenges: ChallengeResponse[] = challengesDoc.map((challenge) => ({
      challengeCompleted: challenge.challengeCompleted,
      currentExperience: challenge.currentExperience,
      id: String(challenge._id),
      level: challenge.level,
      totalExperience: challenge.totalExperience,
      username: challenge.user.name,
      imageUrl: challenge.user.image,
    }));
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
