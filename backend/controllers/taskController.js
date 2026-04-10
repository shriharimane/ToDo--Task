const Task = require('../models/Task');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description, dueDate, assignedTo } = req.body;

  // Validation
  if (!title || !description || !dueDate) {
    return next(new AppError('Title, description, and due date are required', 400));
  }

  const taskType = assignedTo ? 'Assigned' : 'Personal';

  // Validate assigned user exists
  if (assignedTo) {
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return next(new AppError('Assigned user does not exist', 404));
    }
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    taskType,
    createdBy: req.userId,
    assignedTo: assignedTo || null,
  });

  await task.populate('createdBy', 'username email');
  await task.populate('assignedTo', 'username email');

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    task,
  });
});

exports.getTasks = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  const tasks = await Task.find({
    $or: [
      { createdBy: userId, taskType: 'Personal' },
      { taskType: 'Assigned', $or: [{ createdBy: userId }, { assignedTo: userId }] },
    ],
  })
    .populate('createdBy', 'username email')
    .populate('assignedTo', 'username email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

exports.getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('createdBy', 'username email')
    .populate('assignedTo', 'username email');

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check if user has access
  const hasAccess =
    task.createdBy._id.toString() === req.userId ||
    (task.assignedTo && task.assignedTo._id.toString() === req.userId);

  if (!hasAccess) {
    return next(new AppError('You do not have access to this task', 403));
  }

  res.json({
    success: true,
    task,
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('createdBy')
    .populate('assignedTo');

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  const isCreator = task.createdBy._id.toString() === req.userId;
  const isAssignee = task.assignedTo && task.assignedTo._id.toString() === req.userId;

  // Check if user has access
  if (!isCreator && !isAssignee) {
    return next(new AppError('You do not have permission to update this task', 403));
  }

  const { title, description, status, dueDate, assignedTo } = req.body;

  // Role-based permission checks for Assigned tasks
  if (task.taskType === 'Assigned') {
    if (isAssignee && !isCreator) {
      // Assignee can ONLY update status
      if (title !== undefined || description !== undefined || dueDate !== undefined || assignedTo !== undefined) {
        return next(new AppError('Assignee can only update task status', 403));
      }
      if (status !== undefined) {
        task.status = status;
      }
    } else if (isCreator && !isAssignee) {
      // Creator CANNOT update status, but can update other fields
      if (status !== undefined) {
        return next(new AppError('Task creator cannot update task status', 403));
      }
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (assignedTo !== undefined) {
        if (assignedTo) {
          const assignedUser = await User.findById(assignedTo);
          if (!assignedUser) {
            return next(new AppError('Assigned user does not exist', 404));
          }
        }
        task.assignedTo = assignedTo;
      }
    } else if (isCreator && isAssignee) {
      // Both creator and assignee - treat as creator (cannot update status)
      if (status !== undefined) {
        return next(new AppError('Task creator cannot update task status', 403));
      }
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate;
    }
  } else {
    // Personal task - creator can update everything
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
  }

  await task.save();
  await task.populate('createdBy', 'username email');
  await task.populate('assignedTo', 'username email');

  res.json({
    success: true,
    message: 'Task updated successfully',
    task,
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Only creator can delete
  if (task.createdBy.toString() !== req.userId) {
    return next(new AppError('Only task creator can delete the task', 403));
  }

  await Task.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}, 'username email _id');

  res.json({
    success: true,
    count: users.length,
    users,
  });
});
