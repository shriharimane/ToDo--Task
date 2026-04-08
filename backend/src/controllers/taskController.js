import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

const isSameUser = (a, b) => a?.toString() === b?.toString();

const visibilityQuery = (userId) => ({
  $or: [{ creator: userId }, { assignee: userId }]
});

export const listTasks = async (req, res) => {
  const tasks = await Task.find(visibilityQuery(req.user._id))
    .populate('creator', 'name email')
    .populate('assignee', 'name email')
    .sort({ createdAt: -1 });

  return res.status(200).json({ tasks });
};

export const createTask = async (req, res) => {
  const { title, description, status, dueDate, assigneeId } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'title is required' });
  }

  let assignee = null;
  if (assigneeId) {
    if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
      return res.status(400).json({ message: 'Invalid assigneeId' });
    }

    assignee = await User.findById(assigneeId);
    if (!assignee) {
      return res.status(404).json({ message: 'Assignee user not found' });
    }

    if (isSameUser(assignee._id, req.user._id)) {
      return res.status(400).json({ message: 'Use personal task (no assignee) for self tasks' });
    }
  }

  const task = await Task.create({
    title,
    description,
    status: status || 'Todo',
    dueDate: dueDate || null,
    creator: req.user._id,
    assignee: assignee?._id || null
  });

  const populatedTask = await Task.findById(task._id)
    .populate('creator', 'name email')
    .populate('assignee', 'name email');

  return res.status(201).json({ task: populatedTask });
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const isCreator = isSameUser(task.creator, req.user._id);
  const isAssignee = task.assignee && isSameUser(task.assignee, req.user._id);

  if (!isCreator && !isAssignee) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const isAssignedTask = Boolean(task.assignee);

  if (!isAssignedTask) {
    if (!isCreator) {
      return res.status(403).json({ message: 'Only creator can edit personal task' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
  } else {
    if (isAssignee) {
      const forbiddenFields = ['title', 'description', 'dueDate'].filter(
        (field) => req.body[field] !== undefined
      );

      if (forbiddenFields.length > 0) {
        return res
          .status(403)
          .json({ message: `Assignee can only update status. Forbidden: ${forbiddenFields.join(', ')}` });
      }

      if (status === undefined) {
        return res.status(400).json({ message: 'Assignee update requires status' });
      }

      task.status = status;
    }

    if (isCreator) {
      const forbiddenFields = ['status', 'title', 'description'].filter(
        (field) => req.body[field] !== undefined
      );

      if (forbiddenFields.length > 0) {
        return res.status(403).json({
          message: `Assigner can only update dueDate on assigned task. Forbidden: ${forbiddenFields.join(', ')}`
        });
      }

      if (dueDate === undefined) {
        return res.status(400).json({ message: 'Assigner update requires dueDate' });
      }

      task.dueDate = dueDate || null;
    }
  }

  await task.save();

  const updated = await Task.findById(id).populate('creator', 'name email').populate('assignee', 'name email');
  return res.status(200).json({ task: updated });
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (!isSameUser(task.creator, req.user._id)) {
    return res.status(403).json({ message: 'Only creator can delete task' });
  }

  await Task.deleteOne({ _id: id });

  return res.status(200).json({ message: 'Task deleted' });
};

export const listUsers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('name email').sort({ name: 1 });
  return res.status(200).json({ users });
};
