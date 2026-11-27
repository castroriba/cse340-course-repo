import { findUserByEmail, createUser, verifyPassword, getAllUsers } from '../models/users.js';

export const showRegisterForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

export const processRegisterForm = async (req, res, next) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim();
    const password = req.body?.password;

    if (!name || !email || !password || password.length < 6) {
      req.flash('error', 'Name, email, and a password (at least 6 characters) are required.');
      return res.redirect('/register');
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/register');
    }

    await createUser(name, email, password, 'user');
    req.flash('success', 'Registration successful! Please log in.');
    return res.redirect('/login');
  } catch (err) {
    return next(err);
  }
};

export const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

export const processLoginForm = async (req, res, next) => {
  try {
    const email = req.body?.email?.trim();
    const password = req.body?.password;

    if (!email || !password) {
      req.flash('error', 'Email and password are required.');
      return res.redirect('/login');
    }

    const user = await findUserByEmail(email);
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    req.session.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role_name: user.role_name
    };

    req.flash('success', 'Welcome back!');
    return res.redirect('/');
  } catch (err) {
    return next(err);
  }
};

export const logoutUser = (req, res, next) => {
  if (!req.session) {
    return res.redirect('/');
  }
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    return res.redirect('/');
  });
};

export const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash('error', 'You must be logged in to access this page.');
    return res.redirect('/login');
  }
  next();
};

/**
 * Middleware factory to require a specific role for route access.
 * @param {string} role - Required role name (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash('error', 'You must be logged in to access this page.');
      return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
      req.flash('error', 'You do not have permission to access this page.');
      return res.redirect('/');
    }

    next();
  };
};

export const showUsersPage = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.render('users', { title: 'Users', users });
  } catch (err) {
    next(err);
  }
};