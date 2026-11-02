import { getCategories } from './src/models/categories.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

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

// Updated /categories route
app.get('/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.render('categories', { 
      title: 'Categories', 
      categories 
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});