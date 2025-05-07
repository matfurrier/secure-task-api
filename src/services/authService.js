const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const JWT_SECRET = process.env.JWT_SECRET;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username, // Using username as per schema
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

async function createUser(username, password) {
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      // Role defaults to USER as per schema
    },
  });
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function validateUserCredentials(username, password) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return null; // Or throw new Error('Invalid credentials');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return null; // Or throw new Error('Invalid credentials');
  }
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  createUser,
  validateUserCredentials,
}; 