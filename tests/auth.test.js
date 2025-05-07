require('dotenv').config({ path: '.env.test' }); // Load test environment variables

const request = require('supertest');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = require('../src/index'); // Adjust if your app export is different
const prisma = require('../src/config/prisma');

const dbPath = path.join(__dirname, '..', 'test.db'); // Path to the test database file

describe('Auth Endpoints', () => {
  beforeAll(() => {
    // Ensure the test database file exists for SQLite file-based DB before migration
    // For `file:./test.db` Prisma creates it if not present during migrate reset.
    // So, this specific touch command might be redundant but doesn't harm.
    try {
      execSync('npx prisma migrate reset --force --skip-generate', { stdio: 'inherit' });
    } catch (error) {
      console.error("Failed to reset database:", error);
      throw error;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
    // Optionally delete the test database file after tests
    if (fs.existsSync(dbPath)) {
      // fs.unlinkSync(dbPath);
      // fs.unlinkSync(dbPath + "-journal"); // SQLite journal file
      // For now, let's leave it, `migrate reset` will clean it next time.
    }
  });

  let testUser = {
    username: 'testuser',
    password: 'password123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toEqual(testUser.username);
    expect(res.body).not.toHaveProperty('password');
    expect(res.body.role).toEqual('USER'); // Default role
  });

  it('should not register an existing user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message', 'Username already exists');
  });

  it('should login an existing user and return a JWT token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: testUser.username,
        password: testUser.password,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    // Optionally, decode and verify token structure/payload here if needed
  });

  it('should not login with incorrect username', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'wronguser',
        password: testUser.password,
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid username or password');
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: testUser.username,
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid username or password');
  });
}); 