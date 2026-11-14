import db from '../db.js';

/**
 * Get all categories from the database.
 */
const getCategories = async () => {
    const query = `
        SELECT category_id, name 
        FROM categories 
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieve a single category by its ID.
 */
const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name 
        FROM categories 
        WHERE category_id = $1;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Retrieve all categories associated with a given service project.
 */
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM categories c
        JOIN project_categories pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

export { getCategories, getCategoryDetails, getCategoriesByProjectId };