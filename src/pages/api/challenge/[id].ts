import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import Challenge from '../../../models/challenge';
import dbConnect from '../../../utils/dbConnect';

export interface ChallengeResponse {
  id: string;
  level: number;
  currentExperience: number;
  totalExperience: number;
  challengeCompleted: number;
  username: string;
  imageUrl: string;
}

interface UserProps {
  id: string;
  name: string;
  image: string;
}

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

  const user = session.user as UserProps;

  switch (method) {
    case 'GET':
      try {
        const challengeDoc = await Challenge.findOne({
          _id: String(id),
          user: { _id: user.id },
        });

        const challenge: ChallengeResponse = {
          challengeCompleted: challengeDoc.challengeCompleted,
          currentExperience: challengeDoc.currentExperience,
          id: String(challengeDoc._id),
          imageUrl: user.image,
          level: challengeDoc.level,
          totalExperience: challengeDoc.totalExperience,
          username: user.name,
        };
        res.status(200).json(challenge);
      } catch (error) {
        res.status(400).json({ message: 'bad request', error });
      }
      break;
    case 'PUT':
      try {
        const challengeDoc = await Challenge.updateOne(
          { _id: String(id), user: user.id },
          req.body,
          {
            new: true,
            populate: 'user',
          }
        );
        if (!challengeDoc.ok) {
          res.status(400).json({ message: 'bad request' });
          return;
        }

        res.status(200).json(challengeDoc);
      } catch (error) {
        res.status(400).json({ message: 'bad request' });
      }
      break;
    default:
      res.status(400).json({ message: 'bad request' });
      break;
  }
};
