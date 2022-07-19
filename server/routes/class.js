import express from 'express';
import {
  acceptStudent,
  addStudentToClass,
  createClass,
  deleteClass,
  getClass,
  getClasses,
  inputStudentScore,
  removeStudentFromClass,
  requestJoinClass,
  updateClass,
} from '../controllers/class';
import auth from '../middlewares/auth';

const router = express.Router();

router.get('/', auth, getClasses);
router.post('/', auth, createClass);
router.post('/addStudent', auth, addStudentToClass);
router.delete('/delete-student', auth, removeStudentFromClass);
router.post('/request-join-class', auth, requestJoinClass);
router.put('/accept-student', auth, acceptStudent);
router.put('/input-score', auth, inputStudentScore);
router.get('/:code', auth, getClass);
router.put('/:id', auth, updateClass);
router.delete('/:id', auth, deleteClass);

export default router;
