import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pass NODE_ENV to all templates
app.use((req, res, next) => {
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