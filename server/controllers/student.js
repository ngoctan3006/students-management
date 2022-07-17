import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { STUDENT, USER } from '../constants';
import { create, findOne } from '../utils/db_querry';
import { generateUsername } from '../utils/user';

dotenv.config();

export const getMe = async (req, res) => {
  const { user } = req;

  try {
    const result = await findOne(STUDENT, { userId: user.id });

    if (result) {
      return res.json({ ...result });
    }
    res.status(404).json({ message: 'Không tìm thấy thông tin.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  const { fullname, code } = req.body;

  try {
    const username = generateUsername({ name: fullname, code });
    const password = '123456';
    const hash = await bcrypt.hash(password, 12);
    const id = uuidv4();

    const user = await create(USER, {
      id,
      username,
      password: hash,
      role: 0,
    });

    await create(STUDENT, {
      code,
      fullname,
      userId: id,
    });

    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
