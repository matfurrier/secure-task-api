const prisma = require('../config/prisma');

async function createTask(userId, title, description) {
  return prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
}

async function getTasksByUserId(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

async function getTaskById(taskId) {
  return prisma.task.findUnique({
    where: { id: taskId },
  });
}

async function updateTask(taskId, userId, title, description, completed) {
  // Authorization (ensuring user owns the task) should be handled in controller or a dedicated auth layer
  // This service assumes the caller has verified ownership or admin rights if necessary.
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    return null; // Or throw new Error('Task not found');
  }

  // Basic check: only owner can update their task.
  // More complex RBAC (admin override) is usually in controller/middleware.
  if (task.userId !== userId) {
    // This check can be more sophisticated if admins can edit any task.
    // For now, strict ownership for update.
    throw new Error('Forbidden: You can only update your own tasks.'); 
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      completed,
    },
  });
}

async function deleteTask(taskId) {
  // Authorization (who can delete) should be handled in the controller before calling this.
  return prisma.task.delete({
    where: { id: taskId },
  });
}

module.exports = {
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask,
}; 