import db from '../db.js';

/**
 * Retrieve all service projects with their partner organization name.
 */
const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.organization_id,
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
};

/**
 * Retrieve all service projects for a specific partner organization.
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date ASC;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Retrieve the next upcoming service projects (limited by number_of_projects).
 */
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;
    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Retrieve a single service project by its ID, including its partner organization name.
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const queryParams = [id];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Retrieve all service projects associated with a given category.
 */
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        JOIN project_categories pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Create a new service project in the database.
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO projects (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create service project');
    }

    return result.rows[0].project_id;
};

/**
 * Update an existing service project in the database.
 */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE projects
        SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Service project not found');
    }

    return result.rows[0].project_id;
};

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByCategoryId,
    createProject,
    updateProject
};