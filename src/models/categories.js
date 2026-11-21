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

/**
 * Assign a single category to a service project.
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
};

/**
 * Replace all category assignments for a service project.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

/**
 * Create a new category in the database.
 */
const createCategory = async (name) => {
    const query = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

/**
 * Update an existing category in the database.
 */
const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE categories
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;
    const result = await db.query(query, [name, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
};

export {
    getCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    assignCategoryToProject,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};