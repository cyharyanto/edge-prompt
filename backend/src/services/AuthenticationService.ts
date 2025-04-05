// backend/src/services/AuthenticationService.ts
// import bcrypt from 'bcrypt';
import { createUser } from '../db/userRepository.js';

export async function registerUser(
  firstname: string,
  lastname: string,
  email: string,
  passwordhash: string,
  dob: string,
) {
  // const passwordHash = await bcrypt.hash(password, 10);
  // createUser(firstname, lastname, email, passwordHash, dob);
  createUser(firstname, lastname, email, passwordhash, dob);
}
