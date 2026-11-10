import db from '../db.js';

/**
 * Get all service projects along with their organization names.
 */
export async function getAllProjects() {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;
    const result = await db.query(query);
    return result.rows;
}