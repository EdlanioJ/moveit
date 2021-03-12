import { NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { NextApiRequest } from 'next-auth/_utils';
import User from '../../../models/user';
import dbConnect from '../../../utils/dbConnect';

export interface UserResponse {
  id: string;
  image: string;
  name: string;
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

  switch (method) {
    case 'GET':
      const userDoc = await User.findById(id);

      const user: UserResponse = {
        id: String(userDoc._id),
        image: userDoc.image,
        name: userDoc.name,
      };

      res.status(200).json(user);
      break;

    default:
      res.status(400).json({ message: 'bad request' });
      break;
  }
};
