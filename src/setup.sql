DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (category_name) VALUES 
('Environment'),
('Education'),
('Community Service')
ON CONFLICT (category_name) DO NOTHING;