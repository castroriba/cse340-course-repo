import { findUserByEmail, createUser, verifyPassword } from '../models/users.js';

export const showRegisterForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

export const processRegisterForm = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error', 'Email and password are required.');
            return res.redirect('/register');
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            req.flash('error', 'An account with that email already exists.');
            return res.redirect('/register');
        }

        await createUser(email, password, 'user');
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (err) {
        next(err);
    }
};

export const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

export const processLoginForm = async (req, res, next) => {
    try {
        const { email, password } = req.body;

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
            email: user.email,
            role_name: user.role_name
        };

        req.flash('success', 'Welcome back!');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

export const logoutUser = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
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