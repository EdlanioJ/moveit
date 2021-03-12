import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './user';

export interface IChallenge extends Document {
  level?: number;
  currentExperience?: number;
  challengeCompleted?: number;
  totalExperience?: number;
  user: IUser['_id'];
}

const ChallengeSchema = new Schema(
  {
    level: {
      type: Schema.Types.Number,
      default: 1,
    },
    currentExperience: {
      type: Schema.Types.Number,
      default: 0,
    },
    challengeCompleted: {
      type: Schema.Types.Number,
      default: 0,
    },
    totalExperience: {
      type: Schema.Types.Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

let Challenge: Model<IChallenge>;

try {
  Challenge = mongoose.model('Challenge');
} catch (error) {
  Challenge = mongoose.model('Challenge', ChallengeSchema, 'challenges');
}

export default Challenge;
