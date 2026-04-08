import { Router } from 'express';
import {
  createTask,
  deleteTask,
  listTasks,
  listUsers,
  updateTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', listTasks);
router.post('/', createTask);
router.get('/meta/users', listUsers);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
