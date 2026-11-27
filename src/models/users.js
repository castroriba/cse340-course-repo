import bcrypt from 'bcrypt';
import pool from '../db.js';

const SALT_ROUNDS = 10;

// Find a user by email and include their role_name from roles
export const findUserByEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const query = `
    SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE LOWER(u.email) = $1
  `;
  const result = await pool.query(query, [normalizedEmail]);
  return result.rows[0] || null;
};

// Create a new user with a hashed password and default 'user' role
export const createUser = async (name, email, plainPassword, roleName = 'user') => {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  const query = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES (
      $1,
      $2,
      $3,
      (SELECT role_id FROM roles WHERE role_name = $4)
    )
    RETURNING user_id, name, email, role_id
  `;
  const result = await pool.query(query, [normalizedName, normalizedEmail, passwordHash, roleName]);
  return result.rows[0];
};

// Retrieve all registered users along with their role_name
export const getAllUsers = async () => {
  const query = `
    SELECT u.user_id, u.name, u.email, r.role_name, u.created_at
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    ORDER BY u.user_id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Verify a plain-text password against the stored bcrypt hash
export const verifyPassword = async (plainPassword, passwordHash) => {
  if (!plainPassword || !passwordHash) return false;
  return bcrypt.compare(plainPassword, passwordHash);
};