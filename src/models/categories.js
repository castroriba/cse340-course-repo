import db from '../db.js';

/**
 * Get all categories from the database.
 */
export const getCategories = async () => {
    const query = `
        SELECT category_id, name 
        FROM categories 
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};