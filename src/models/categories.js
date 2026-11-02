import pool from '../db.js'; // Adjust path if your database pool file is located elsewhere

/**
 * Retrieves all categories from the database.
 */
export async function getCategories() {
    const sql = 'SELECT * FROM categories ORDER BY category_name ASC;';
    const result = await pool.query(sql);
    return result.rows;
}