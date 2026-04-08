import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';

dotenv.config();

const users = [
  { name: 'Alice Manager', email: 'alice@example.com', password: 'Password123!' },
  { name: 'Bob Contributor', email: 'bob@example.com', password: 'Password123!' }
];

const run = async () => {
  await connectDB();

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      const hash = await bcrypt.hash(user.password, 10);
      await User.create({
        name: user.name,
        email: user.email,
        password: hash
      });
    }
  }

  console.log('Seed complete');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
