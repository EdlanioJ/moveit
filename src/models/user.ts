import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  image: string;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

let User: Model<IUser>;

try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', UserSchema, 'users');
}
export default User;
