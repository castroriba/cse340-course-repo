import db from '../db.js';

/**
 * Get all organizations from the database.
 */
export const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_url 
        FROM organizations 
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};