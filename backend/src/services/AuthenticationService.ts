import { db } from '../database.js';

export async function registerUser(
  firstname: string,
  lastname: string,
  email: string,
  passwordhash: string,
  dob: string,
) {
  const stmt = await db.prepare(`
    INSERT INTO users (firstname, lastname, email, passwordhash, dob)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(firstname, lastname, email, passwordhash, dob);
}