import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import Challenge from '../../../models/challenge';
import dbConnect from '../../../utils/dbConnect';

import { ChallengeResponse } from './index';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'unauthorized request' });
    return;
  }

  switch (method) {
    case 'GET':
      try {
        const challengeDoc = await Challenge.findById(id).populate('user');

        if (!challengeDoc) {
          res.status(400).json({ message: 'bad request' });
          return;
        }
        const challenge: ChallengeResponse = {
          challengeCompleted: challengeDoc.challengeCompleted,
          currentExperience: challengeDoc.currentExperience,
          id: String(challengeDoc._id),
          level: challengeDoc.level,
          totalExperience: challengeDoc.totalExperience,
          username: challengeDoc.user.name,
          imageUrl: challengeDoc.user.image,
        };

        res.status(200).json(challenge);
      } catch (error) {
        res.status(400).json({ message: 'bad request' });
      }
      break;
    case 'PUT':
      try {
        const challengeDoc = await Challenge.findByIdAndUpdate(id, req.body, {
          new: true,
          populate: 'user',
        });

        if (!challengeDoc) {
          res.status(400).json({ message: 'bad request' });
          return;
        }

        const challenge: ChallengeResponse = {
          challengeCompleted: challengeDoc.challengeCompleted,
          currentExperience: challengeDoc.currentExperience,
          id: String(challengeDoc._id),
          level: challengeDoc.level,
          totalExperience: challengeDoc.totalExperience,
          username: challengeDoc.user.name,
          imageUrl: challengeDoc.user.image,
        };

        res.status(200).json(challenge);
      } catch (error) {
        res.status(400).json({ message: 'bad request' });
      }
      break;
    default:
      res.status(400).json({ message: 'bad request' });
      break;
  }
};
