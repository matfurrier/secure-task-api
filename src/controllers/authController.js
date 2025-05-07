const authService = require('../services/authService');

async function registerUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await authService.createUser(username, password);
    // Omit password from response is already handled in service
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'Username already exists') {
      return res.status(409).json({ message: error.message });
    }
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await authService.validateUserCredentials(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = authService.generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
}

module.exports = {
  registerUser,
  loginUser,
}; 