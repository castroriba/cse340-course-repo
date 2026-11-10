import express from 'express';
import dotenv from 'dotenv';
import { getCategories } from './src/models/categories.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllOrganizations } from './src/models/organizations.js';

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

// Dynamic Organizations route
app.get('/organizations', async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', { 
      title: 'Organizations', 
      organizations 
    });
  } catch (err) {
    console.error('Error fetching organizations:', err);
    res.status(500).send('Server Error');
  }
});

// Dynamic Projects route (W02 Team Activity requirement)
app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.render('projects', { 
      title: 'Service Projects', 
      projects 
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send('Server Error');
  }
});

// Dynamic Categories route (W02 Assignment requirement)
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