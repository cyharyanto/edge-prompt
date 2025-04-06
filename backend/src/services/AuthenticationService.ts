import { db } from '../database.js';

export async function registerUser(
  firstname: string,
  lastname: string,
  email: string,
  passwordhash: string,
  dob: string,
) {
  // Check if the user already exists - connected to database.ts
  const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser) {
    throw new Error('User already exists');
  } else {
    const stmt = await db.prepare(`
      INSERT INTO users (firstname, lastname, email, passwordhash, dob)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(firstname, lastname, email, passwordhash, dob);
  }
}