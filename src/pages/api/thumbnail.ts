import { NextApiRequest, NextApiResponse } from 'next';
import { getScreenshot } from '../../lib/chromium';
import getThumbTemplate from '../../lib/thumbTemplate';

const isDev = !process.env.AWS_REGION;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;

    const level = Number(query.level);
    const completedChallenge = Number(query.completedChallenge);
    const totalExperience = Number(query.totalExperience);

    if (!level || !completedChallenge || !totalExperience) {
      throw new Error('missing query params');
    }

    const html = getThumbTemplate(level, completedChallenge, totalExperience);

    const file = await getScreenshot(html, isDev);

    res.setHeader('Content-Type', 'image/png');

    return res.end(file);
  } catch (error) {
    console.error(error);

    res.status(500).send('internal server error');
  }
};
