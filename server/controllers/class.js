import { v4 as uuidv4 } from 'uuid';
import { CLASS, CLASS_STUDENT, STUDENT, TEACHER } from '../constants';
import { create, deleteRow, find, findOne, getStudentClass, update } from '../utils/db_querry';

export const getClasses = async (req, res) => {
  const { id: userId, role } = req.user;
  try {
    const user = await findOne(TEACHER, { userId });
    if (!user || role < 1) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await find(CLASS, { teacherCode: user.code });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getClassesStudent = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const user = await findOne(STUDENT, { userId });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await getStudentClass(user.code);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getClass = async (req, res) => {
  const { id: userId, role } = req.user;
  const { code } = req.params;
  try {
    const user = await findOne(TEACHER, { userId });
    if (!user || role !== 1) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await findOne(CLASS, { teacherCode: user.code, code });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  const { classCode, subjectName, semester, room } = req.body;
  const { id: userId, role } = req.user;

  if (!classCode || !subjectName || !semester || !room) {
    return res.status(400).json({ message: 'Không được bỏ trống các trường!' });
  }

  try {
    const user = await findOne(TEACHER, { userId });

    if (!user || role < 1) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    const classExist = await findOne(CLASS, { code: classCode });
    if (classExist) {
      return res.status(400).json({ message: 'Lớp đã tồn tại!' });
    }

    const newClass = {
      id: uuidv4(),
      code: classCode,
      room,
      semester,
      teacherCode: user.code,
      subjectName,
    };

    await create(CLASS, newClass);

    await res.json(newClass);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateClass = async (req, res) => {
  const { classCode, subjectName, semester, room } = req.body;
  const { id: userId, role } = req.user;
  const { id } = req.params;

  if (!classCode || !subjectName || !semester || !room) {
    return res.status(400).json({ message: 'Không được bỏ trống các trường!' });
  }

  try {
    const user = await findOne(TEACHER, { userId });

    if (!user || role < 1) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    await update(
      CLASS,
      { id },
      {
        code: classCode,
        room,
        semester,
        subjectName,
      }
    );

    await res.json({ message: 'Cập nhật lớp thành công!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  const { id: userId, role } = req.user;
  const { id } = req.params;

  try {
    const user = await findOne(TEACHER, { userId });

    if (!user || role !== 1) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    const classExist = await findOne(CLASS, { id });
    if (!classExist) {
      return res.status(404).json({ message: 'Lớp không tồn tại!' });
    }

    await deleteRow(CLASS, { id });

    await res.json({ message: 'Xóa lớp thành công!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const addStudentToClass = async (req, res) => {
  const { id: userId, role } = req.user;
  const { classCode, studentCode } = req.body;

  if (!classCode || !studentCode) {
    return res.status(400).json({ message: 'Không được bỏ trống các trường!' });
  }

  try {
    const user = await findOne(TEACHER, { userId });

    if (!user || role < 1) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    const classExist = await findOne(CLASS, { code: classCode });
    if (!classExist) {
      return res.status(400).json({ message: 'Lớp không tồn tại!' });
    }

    const studentExist = await findOne(STUDENT, { code: studentCode });
    if (!studentExist) {
      return res.status(400).json({ message: 'Sinh viên không tồn tại!' });
    }

    const isAdded = await findOne(CLASS_STUDENT, { classCode, studentCode });
    if (isAdded) {
      return res.status(400).json({ message: 'Sinh viên đã có trong lớp!' });
    }

    const newStudent = {
      id: uuidv4(),
      classCode,
      studentCode,
      status: 1,
    };

    await create(CLASS_STUDENT, newStudent);
    const student = await findOne(STUDENT, { code: studentCode });

    res.json({ ...newStudent, ...student, midterm: null, final: null });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const removeStudentFromClass = async (req, res) => {
  const { id: userId, role } = req.user;
  const { classCode, studentCode } = req.body;

  if (!classCode || !studentCode) {
    return res.status(400).json({ message: 'Không được bỏ trống các trường!' });
  }

  try {
    const user = await findOne(TEACHER, { userId });

    if (!user || role < 1) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    const classExist = await findOne(CLASS, { code: classCode });
    if (!classExist) {
      return res.status(400).json({ message: 'Lớp không tồn tại!' });
    }

    const studentExist = await findOne(STUDENT, { code: studentCode });
    if (!studentExist) {
      return res.status(400).json({ message: 'Sinh viên không tồn tại!' });
    }

    const isAdded = await findOne(CLASS_STUDENT, { classCode, studentCode });
    if (!isAdded) {
      return res.status(400).json({ message: 'Sinh viên không có trong lớp!' });
    }

    await deleteRow(CLASS_STUDENT, { classCode, studentCode });

    res.json({ message: 'Xóa sinh viên khỏi lớp thành công!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const acceptStudent = async (req, res) => {
  const { id: userId, role } = req.user;
  const { classCode, studentCode } = req.body;

  if (!classCode || !studentCode) {
    return res.status(400).json({ message: 'Không được bỏ trống các trường!' });
  }

  try {
    const user = await findOne(TEACHER, { userId });

    if (!user || role < 1) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    const classExist = await findOne(CLASS, { code: classCode });
    if (!classExist) {
      return res.status(400).json({ message: 'Lớp không tồn tại!' });
    }

    const isPending = await findOne(CLASS_STUDENT, { classCode, studentCode });
    if (!isPending || isPending.status === 1) {
      return res.status(400).json({ message: 'Không tìm thấy yêu cầu!' });
    }

    await update(CLASS_STUDENT, { classCode, studentCode }, { status: 1 });
    res.json({ message: 'Thêm sinh viên vào lớp thành công!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const requestJoinClass = async (req, res) => {
  const { id: userId } = req.user;
  const { classCode } = req.body;

  if (!classCode) {
    return res.status(400).json({ message: 'Không được bỏ trống các trường!' });
  }

  try {
    const user = await findOne(STUDENT, { userId });

    if (!user) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    const classExist = await findOne(CLASS, { code: classCode });
    if (!classExist) {
      return res.status(400).json({ message: 'Lớp không tồn tại!' });
    }

    const studentCode = user.code;

    const isAdded = await findOne(CLASS_STUDENT, { classCode, studentCode });
    if (isAdded) {
      if (isAdded.status === 0) {
        return res.status(400).json({
          message: 'Bạn đã yêu cầu tham gia lớp này, hãy đợi giáo viên chấp nhận bạn vào lớp!',
        });
      }
      return res.status(400).json({ message: 'Bạn đã ở trong lớp này rồi!' });
    }

    await create(CLASS_STUDENT, {
      id: uuidv4(),
      classCode,
      studentCode,
    });

    res.json({ message: 'Yêu cầu tham gia lớp thành công!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const inputStudentScore = async (req, res) => {
  const { id: userId, role } = req.user;
  const { classCode, studentCode, midterm, final } = req.body;

  if (!classCode || !studentCode) {
    return res.status(400).json({ message: 'Không được bỏ trống các trường!' });
  }

  try {
    const user = await findOne(TEACHER, { userId });

    if (!user || role < 1) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    const classExist = await findOne(CLASS, { code: classCode });
    if (!classExist) {
      return res.status(400).json({ message: 'Lớp không tồn tại!' });
    }

    const studentExist = await findOne(STUDENT, { code: studentCode });
    if (!studentExist) {
      return res.status(400).json({ message: 'Sinh viên không tồn tại!' });
    }

    const isAdded = await findOne(CLASS_STUDENT, { classCode, studentCode });
    if (!isAdded) {
      return res.status(400).json({ message: 'Sinh viên không có trong lớp!' });
    } else if (isAdded.status !== 1) {
      return res.status(400).json({ message: 'Sinh viên không có trong lớp!' });
    }

    await update(CLASS_STUDENT, { classCode, studentCode }, { midterm, final });
    res.json({ message: 'Nhập điểm thành công!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const outClass = async (req, res) => {
  const { id: userId } = req.user;
  const { classCode } = req.body;

  if (!classCode) {
    return res.status(400).json({ message: 'Không được bỏ trống các trường!' });
  }

  try {
    const user = await findOne(STUDENT, { userId });

    if (!user) {
      return res.status(403).json({ message: 'Không có quyền!' });
    }

    const isJoined = await findOne(CLASS_STUDENT, { classCode, studentCode: user.code });
    if (!isJoined) {
      return res.status(400).json({ message: 'Bạn chưa đăng ký lớp học này!' });
    }

    await deleteRow(CLASS_STUDENT, { classCode, studentCode: user.code });

    res.json({ message: 'Bạn đã hủy đăng ký lớp thành công!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
