import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from 'public' directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  const title = 'Home';
  res.render('index', { title });
});

app.get('/organizations', (req, res) => {
  const title = 'Organizations';
  res.render('organizations', { title });
});

app.get('/projects', (req, res) => {
  const title = 'Service Projects';
  res.render('projects', { title });
});

app.get('/categories', (req, res) => {
  const title = 'Categories';
  res.render('categories', { title });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});