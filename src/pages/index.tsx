import mongoose from 'mongoose';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import ChallengeBox from '../components/ChallengeBox';

import CompletedChallenge from '../components/CompletedChallenge';
import Countdown from '../components/Countdown';
import ExperienceBar from '../components/ExperienceBar';
import Profile from '../components/Profile';
import Sidebar from '../components/Sidebar';
import {
  ChallengeProvider,
  ChallengeResultProps,
} from '../context/ChallengeContext';
import { CountdownProvider } from '../context/CountdownContext';
import Challenge, { IChallenge } from '../models/challenge';
import User from '../models/user';

import styles from '../styles/pages/Home.module.css';
import api from '../utils/api';
import dbConnect from '../utils/dbConnect';
import { ChallengeResponse } from './api/challenge';

interface UserProps {
  id: string;
  name: string;
  image: string;
}

interface HomeProps {
  user: UserProps;
  challenge: ChallengeResultProps;
  sessionToken: string;
}
const Home: NextPage<HomeProps> = ({ challenge, sessionToken, user }) => {
  return (
    <ChallengeProvider sessionToken={sessionToken} challenge={challenge}>
      <div className={styles.main}>
        <Sidebar />
        <div className={styles.container}>
          <Head>
            <title>Inicio | move.it</title>
          </Head>
          <ExperienceBar />
          <CountdownProvider>
            <section>
              <div>
                <Profile name={user.name} image={user.image} />
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

  const { 'next-auth.session-token': sessionToken } = req.cookies;

  const { level, currentExperience, challengeCompleted } = ctx.req.cookies;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { statusCode: 302, destination: '/login' },
      props: {},
    };
  }

  try {
    const { 'next-auth.session-token': sessionToken } = req.cookies;
    const { id } = session.user as UserProps;

    const response = await api.get<ChallengeResponse>(
      `/api/challenge/user/${id}`,
      {
        headers: { cookie: `next-auth.session-token=${sessionToken} ` },
      }
    );

    const { data } = response;

    const user = session.user as UserProps;

    return {
      props: {
        user: {
          id: user.id,
          image: user.image,
          name: user.name,
        },
        sessionToken,
        challenge: data,
      },
    };
  } catch (error) {
    return {
      redirect: { statusCode: 302, destination: '/leaderboard' },
      props: {},
    };
  }
};
