import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Challenge from '../../../models/challenge';
import User from '../../../models/user';
import dbConnect from '../../../utils/dbConnect';

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      Providers.Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
      signIn: '/login',
    },
    callbacks: {
      session: (session, user) => {
        return Promise.resolve({ ...session, user: user });
      },
    },
    database: process.env.MONGODB_URI,
  });
