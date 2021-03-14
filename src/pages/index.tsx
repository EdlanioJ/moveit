import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';

import ChallengeBox from '../components/ChallengeBox';
import CompletedChallenge from '../components/CompletedChallenge';
import Countdown from '../components/Countdown';
import ExperienceBar from '../components/ExperienceBar';
import Profile from '../components/Profile';
import Sidebar from '../components/Sidebar';

import { ChallengeProvider } from '../context/ChallengeContext';
import { CountdownProvider } from '../context/CountdownContext';

import Challenge, { IChallenge } from '../models/challenge';
import User from '../models/user';

import dbConnect from '../utils/dbConnect';
import { ChallengeResponse } from './api/challenge/[id]';

import styles from '../styles/pages/Home.module.css';

interface UserProps {
  id: string;
  name: string;
  image: string;
}

interface HomeProps {
  challenge: ChallengeResponse;
}
const Home: NextPage<HomeProps> = ({ challenge }) => {
  return (
    <ChallengeProvider challenge={challenge}>
      <div className={styles.main}>
        <Sidebar />
        <div className={styles.container}>
          <Head>
            <title>{challenge.username} | move.it</title>
          </Head>
          <ExperienceBar />
          <CountdownProvider>
            <section>
              <div>
                <Profile name={challenge.username} image={challenge.imageUrl} />
                <CompletedChallenge />
                <Countdown />
              </div>
              <div>
                <ChallengeBox />
              </div>
            </section>
          </CountdownProvider>
        </div>
      </div>
    </ChallengeProvider>
  );
};

export default Home;

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
  let challengeDoc: IChallenge;
  const user = session.user as UserProps;
  try {
    await dbConnect();
    const userDoc = await User.findById(user.id);
    challengeDoc = await Challenge.findOne({ user: userDoc });

    if (!challengeDoc) {
      challengeDoc = await Challenge.create({
        user: userDoc,
        totalExperience: 0,
        challengeCompleted: 0,
        currentExperience: 0,
        level: 1,
      });
    }

    const challenge: ChallengeResponse = {
      challengeCompleted: challengeDoc.challengeCompleted,
      currentExperience: challengeDoc.currentExperience,
      id: String(challengeDoc._id),
      imageUrl: userDoc.image,
      level: challengeDoc.level,
      totalExperience: challengeDoc.totalExperience,
      username: user.name,
    };

    return {
      props: {
        challenge: challenge,
      },
    };
  } catch (error) {
    res.writeHead(302, { Location: '/leaderboard' });
    res.end();
    return {
      props: {},
    };
  }
};
