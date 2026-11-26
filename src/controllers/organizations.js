import { body, validationResult } from 'express-validator';
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const PLACEHOLDER_LOGO = '/images/placeholder-logo.svg';

// Server-side validation rules for creating/updating organizations
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required'),
    body('contactEmail')
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (err) {
        next(err);
    }
};

const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            const err = new Error('Organization Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganizationId(organizationId);
        const title = `${organizationDetails.name} - Organization Details`;

        res.render('organization', { title, organizationDetails, projects });
    } catch (err) {
        next(err);
    }
};

const showNewOrganizationForm = async (req, res, next) => {
    try {
        const title = 'Add New Organization';
        res.render('new-organization', { title });
    } catch (err) {
        next(err);
    }
};

const processNewOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = PLACEHOLDER_LOGO;

    try {
        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
        req.flash('success', 'Organization added successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error('Error creating organization:', error);
        req.flash('error', 'There was an error creating the organization.');
        res.redirect('/new-organization');
    }
};

const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            const err = new Error('Organization Not Found');
            err.status = 404;
            return next(err);
        }

        const title = 'Edit Organization';
        res.render('edit-organization', { title, organizationDetails });
    } catch (err) {
        next(err);
    }
};

const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-organization/${organizationId}`);
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = req.body.logoFilename?.trim() || PLACEHOLDER_LOGO;

    try {
        await updateOrganization(organizationId, name, description, contactEmail, logoFilename);
        req.flash('success', 'Organization updated successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error('Error updating organization:', error);
        req.flash('error', 'There was an error updating the organization.');
        res.redirect(`/edit-organization/${organizationId}`);
    }
};

export {
    organizationValidation,
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
};