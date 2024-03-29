import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];

    if (token) {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedData;
    } else {
      res.status(401).json({ message: 'Token không tồn tại.' });
    }
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export default auth;
