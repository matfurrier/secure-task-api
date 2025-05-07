require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const { execSync } = require('child_process');
const app = require('../src/index');
const prisma = require('../src/config/prisma');

let regularUserToken;
let regularUserId;
let adminUserToken;
// let adminUserId; // We might not need adminUserId if we only use the token

const regularUserData = { username: 'taskuser', password: 'password123' };
const adminUserData = { username: 'taskadmin', password: 'password123' };

describe('Task Endpoints', () => {
  beforeAll(async () => {
    try {
      execSync('npx prisma migrate reset --force --skip-generate', { stdio: 'inherit' });
    } catch (error) {
      console.error("Failed to reset database for tasks test:", error);
      throw error;
    }

    // Register and login regular user
    await request(app).post('/auth/register').send(regularUserData);
    let res = await request(app).post('/auth/login').send(regularUserData);
    regularUserToken = res.body.token;
    // Decode token to get userId (alternative: get from register response if it returns full user)
    const regularUserRegistered = await prisma.user.findUnique({where: {username: regularUserData.username}});
    regularUserId = regularUserRegistered.id;


    // Register admin user and update role to ADMIN
    await request(app).post('/auth/register').send(adminUserData);
    const adminUser = await prisma.user.update({
      where: { username: adminUserData.username },
      data: { role: 'ADMIN' },
    });
    // adminUserId = adminUser.id;
    res = await request(app).post('/auth/login').send(adminUserData);
    adminUserToken = res.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let task1Id;

  describe('Task Creation and Retrieval', () => {
    it('should not allow access to /tasks without a token', async () => {
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toEqual(401);
    });

    it('should not allow access to /tasks with an invalid token', async () => {
        const res = await request(app).get('/tasks').set('Authorization', 'Bearer invalidtoken');
        expect(res.statusCode).toEqual(403); // Or 401 depending on middleware strictness
      });

    it('should create a new task for an authenticated user', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({ title: 'Test Task 1', description: 'Description for task 1' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Test Task 1');
      expect(res.body.userId).toBe(regularUserId);
      task1Id = res.body.id;
    });

    it('should get all tasks for the authenticated user', async () => {
      // Create another task for the same user
      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({ title: 'Test Task 2', description: 'Description for task 2' });

      const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${regularUserToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body.every(task => task.userId === regularUserId)).toBe(true);
    });
  });

  describe('Task Update', () => {
    it('should update a task owned by the user', async () => {
      const res = await request(app)
        .put(`/tasks/${task1Id}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({ title: 'Updated Task 1', completed: true });
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe('Updated Task 1');
      expect(res.body.completed).toBe(true);
    });

    it('should not update a task if not owned by the user', async () => {
      // Admin creates a task
      const adminTaskRes = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send({ title: 'Admin Task' });
      const adminTaskId = adminTaskRes.body.id;

      const res = await request(app)
        .put(`/tasks/${adminTaskId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({ title: 'Attempt to update admin task' });
      expect(res.statusCode).toEqual(403); 
    });
  });

  describe('Task Deletion (RBAC)', () => {
    let taskToDeleteByOwnerId;
    let taskToDeleteByAdminId;

    beforeAll(async () => { // Changed from beforeEach to beforeAll for this describe block
        // Task for owner deletion test
        const resOwner = await request(app)
            .post('/tasks').set('Authorization', `Bearer ${regularUserToken}`)
            .send({ title: 'Task to be deleted by owner' });
        taskToDeleteByOwnerId = resOwner.body.id;

        // Task for admin deletion test (created by regular user)
        const resAdmin = await request(app)
            .post('/tasks').set('Authorization', `Bearer ${regularUserToken}`)
            .send({ title: 'Another user task for admin to delete' });
        taskToDeleteByAdminId = resAdmin.body.id;
    });

    it('should allow a user to delete their own task', async () => {
      const res = await request(app)
        .delete(`/tasks/${taskToDeleteByOwnerId}`)
        .set('Authorization', `Bearer ${regularUserToken}`);
      expect(res.statusCode).toEqual(204);
    });

    it('should not allow a user to delete a task they do not own (if not admin)', async () => {
        // Admin creates a task
        const adminTaskRes = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${adminUserToken}`)
            .send({ title: 'Admin Task For Deletion Test' });
        const adminTaskId = adminTaskRes.body.id;

        const res = await request(app)
            .delete(`/tasks/${adminTaskId}`)
            .set('Authorization', `Bearer ${regularUserToken}`);
        expect(res.statusCode).toEqual(403);
    });

    it('should allow an admin to delete any task', async () => {
      const res = await request(app)
        .delete(`/tasks/${taskToDeleteByAdminId}`)
        .set('Authorization', `Bearer ${adminUserToken}`);
      expect(res.statusCode).toEqual(204);
    });
  });

}); 