import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import Challenge from '../../../models/challenge';
import User from '../../../models/user';
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

interface UserSessionProps {
  id: string;
  name: string;
  image: string;
}
const challengeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  await dbConnect();

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'unauthorized request' });
    return;
  }

  switch (method) {
    case 'GET':
      try {
        const challengesDoc = await Challenge.find({}, null, {
          sort: { totalExperience: 'desc' },
          populate: 'user',
        });

        const challenges: ChallengeResponse[] = challengesDoc.map(
          (challenge) => ({
            challengeCompleted: challenge.challengeCompleted,
            currentExperience: challenge.currentExperience,
            id: String(challenge._id),
            level: challenge.level,
            totalExperience: challenge.totalExperience,
            username: challenge.user.name,
            imageUrl: challenge.user.image,
          })
        );
        res.status(200).json(challenges);
      } catch (error) {
        res.status(400).json({ message: 'bad request' });
      }
      break;
    case 'POST':
      try {
        const { id } = session.user as UserSessionProps;

        const userDoc = await User.findById(id);

        if (!userDoc) {
          res.status(400).json({ message: 'bad request' });
          return;
        }

        const challengeDoc = await Challenge.create({
          user: userDoc,
        });

        const challenge: ChallengeResponse = {
          challengeCompleted: challengeDoc.challengeCompleted,
          currentExperience: challengeDoc.currentExperience,
          id: String(challengeDoc._id),
          imageUrl: userDoc.image,
          level: challengeDoc.level,
          totalExperience: challengeDoc.totalExperience,
          username: String(userDoc._id),
        };

        res.status(201).json(challenge);
      } catch (error) {
        res.status(400).json({ message: 'bad request' });
      }
      break;
    default:
      res.status(400).json({ message: 'bad request' });
      break;
  }
};

export default challengeHandler;
