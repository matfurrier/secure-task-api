const taskService = require('../services/taskService');

async function createTask(req, res) {
  const { title, description } = req.body;
  const userId = req.user.id; // From authenticateToken middleware

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const task = await taskService.createTask(userId, title, description);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
}

async function getUserTasks(req, res) {
  const userId = req.user.id; // From authenticateToken middleware
  try {
    const tasks = await taskService.getTasksByUserId(userId);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
}

async function updateTask(req, res) {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, completed } = req.body;

  if (title === undefined && description === undefined && completed === undefined) {
    return res.status(400).json({ message: 'At least one field (title, description, completed) must be provided for update' });
  }

  try {
    // Service layer handles ownership check for update currently
    const updatedTask = await taskService.updateTask(taskId, userId, title, description, completed);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to update it' });
    }
    res.json(updatedTask);
  } catch (error) {
    if (error.message.startsWith('Forbidden:')) {
        return res.status(403).json({ message: error.message });
    }
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
}

async function deleteTask(req, res) {
  const taskId = req.params.id;
  const requestingUser = req.user; // Contains id and role

  try {
    const task = await taskService.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // RBAC: User can delete their own task, or admin can delete any task
    if (task.userId !== requestingUser.id && requestingUser.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this task' });
    }

    await taskService.deleteTask(taskId);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
}

module.exports = {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
}; 