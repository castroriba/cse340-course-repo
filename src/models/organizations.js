import db from '../db.js';

/**
 * Retrieve all organizations from the database.
 */
const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_url
        FROM organizations
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieve a single organization by its ID.
 */
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_url
        FROM organizations
        WHERE organization_id = $1;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllOrganizations, getOrganizationDetails };