import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  getStudentSkillGapById,
} from './item.model.js';

const router = Router();

router.get('/students', async (_req, res) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/students/:studentId', async (req, res) => {
  try {
    const student = await getStudentById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/students/:studentId/skill-gap', async (req, res) => {
  try {
    const skillGap = await getStudentSkillGapById(req.params.studentId);

    if (!skillGap) {
      return res.status(404).json({ message: 'Student skill gap data not found' });
    }

    return res.json(skillGap);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;