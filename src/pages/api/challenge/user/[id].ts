import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { ChallengeResponse } from '..';
import Challenge from '../../../../models/challenge';
import User from '../../../../models/user';
import dbConnect from '../../../../utils/dbConnect';

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
    case 'POST':
      const userDoc = await User.findById(id);
      const challengeDoc = await Challenge.findOne(
        { user: userDoc },
        null,
        {},
        async (err, doc) => {
          if (!doc) {
            return await Challenge.create({ user: userDoc });
          } else {
            return doc;
          }
        }
      );

      const challenge: ChallengeResponse = {
        id: String(challengeDoc._id),
        challengeCompleted: challengeDoc.challengeCompleted,
        currentExperience: challengeDoc.currentExperience,
        imageUrl: userDoc.image,
        level: challengeDoc.level,
        totalExperience: challengeDoc.totalExperience,
        username: userDoc.name,
      };

      res.status(200).json(challenge);
      break;

    default:
      break;
  }
};
