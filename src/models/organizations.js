import db from '../db.js';

/**
 * Get all organizations from the database.
 */
export async function getAllOrganizations() {
    const query = `
        SELECT organization_id, name, description, logo_url 
        FROM organizations 
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
}