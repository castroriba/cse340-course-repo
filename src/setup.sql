-- Drop existing tables if re-running script
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;

-- 1. Create Organizations Table (Includes contact_email)
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    contact_email VARCHAR(150) NOT NULL,
    logo_url VARCHAR(255)
);

-- 2. Create Projects Table (W02 Team Activity)
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(organization_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    project_date DATE
);

-- 3. Create Categories Table (W02 Assignment)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Create Many-to-Many Junction Table between Projects and Categories
CREATE TABLE project_categories (
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Seed Organizations (At least 3, with contact_email)
INSERT INTO organizations (name, description, contact_email, logo_url) VALUES
('Eco Action', 'Environmental conservation and park restoration.', 'contact@ecoaction.org', '/images/org1.svg'),
('Edu Alliance', 'STEM education and youth mentoring.', 'info@edualliance.org', '/images/org2.svg'),
('Care Center', 'Community food distribution and shelter support.', 'support@carecenter.org', '/images/org3.svg');

-- Seed Service Projects (At least 5 per organization = 15 total)
INSERT INTO projects (organization_id, title, description, location, project_date) VALUES
(1, 'Tree Planting Drive', 'Planting native trees in city parks.', 'Central Park', '2026-04-15'),
(1, 'River Clean Up', 'Removing plastic trash from river banks.', 'Riverside Walk', '2026-05-10'),
(1, 'Community Garden Setup', 'Building raised garden beds.', 'Eastside Park', '2026-06-01'),
(1, 'E-Waste Recycling', 'Collecting discarded electronics.', 'City Square', '2026-06-20'),
(1, 'Compost Workshop', 'Teaching local residents composting techniques.', 'Community Center', '2026-07-05'),
(2, 'After-School Tutoring', 'Providing STEM homework help.', 'Public Library', '2026-04-18'),
(2, 'Coding Bootcamp for Youth', 'Introductory Scratch and Python lessons.', 'Tech Hub', '2026-05-12'),
(2, 'Book Drive & Literacy Fair', 'Distributing books to elementary students.', 'Lincoln Elementary', '2026-05-28'),
(2, 'Science Fair Mentorship', 'Guiding middle school science projects.', 'Edu Lab', '2026-06-14'),
(2, 'Math Olympiad Prep', 'Coaching high schoolers for competition.', 'Civic Hall', '2026-07-02'),
(3, 'Food Bank Outreach', 'Distributing food parcels to families.', 'Main Shelter', '2026-04-20'),
(3, 'Soup Kitchen Volunteer Day', 'Preparing warm evening meals.', 'Downtown Kitchen', '2026-05-15'),
(3, 'Coat & Blanket Drive', 'Collecting winter clothing for homeless.', 'Care Warehouse', '2026-06-05'),
(3, 'Senior Center Companion Visit', 'Spending quality social time with seniors.', 'Sunshine Home', '2026-06-25'),
(3, 'Health Pack Assembly', 'Packing essential hygiene kits.', 'Community Center', '2026-07-10');

-- Seed Categories (At least 3)
INSERT INTO categories (name) VALUES
('Environment'),
('Education'),
('Community Service');

-- Link Projects to Categories
INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3);