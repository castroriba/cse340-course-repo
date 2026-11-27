import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import router from './src/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Parse incoming form data (req.body)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Flash message middleware
app.use((req, res, next) => {
  req.flash = (type, message) => {
    if (!req.session.flash) {
      req.session.flash = {};
    }
    if (!req.session.flash[type]) {
      req.session.flash[type] = [];
    }
    req.session.flash[type].push(message);
  };

  res.locals.flash = req.session.flash || {};
  delete req.session.flash;
  next();
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pass session user, auth state, flash messages, and NODE_ENV to all templates
app.use((req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session && req.session.user);
  res.locals.user = (req.session && req.session.user) || null;
  res.locals.messages = res.locals.flash || {};
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// Use external router (all routes and controllers live in src/)
app.use('/', router);

// Catch-all 404 Not Found middleware
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global 500/404 error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  if (err.stack) {
    console.error(err.stack);
  }

  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  res.status(status).render(`errors/${template}`, {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
    stack: NODE_ENV === 'production' ? null : err.stack,
    NODE_ENV
  });
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port} in ${NODE_ENV} mode`);
});