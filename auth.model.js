import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllStudents } from './item.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const loginDbFilePath = path.join(__dirname, 'db', 'login_users.json');

async function readLoginDatabase() {
  const rawContent = await readFile(loginDbFilePath, 'utf8');
  const records = JSON.parse(rawContent);

  return records.map((record) => ({
    email: String(record.email).toLowerCase(),
    password: String(record.password),
    role: record.role,
    displayName: record.displayName,
    studentId: record.studentId ?? null,
    source: 'login-db',
  }));
}

function buildStudentLoginAccounts(students) {
  return students.map((student) => ({
    email: `${student.id.toLowerCase()}@student.ikmb.edu.my`,
    password: 'password123',
    role: 'user',
    displayName: `Pelajar ${student.id}`,
    studentId: student.id,
    source: 'dummy-student-db',
  }));
}

function sanitiseUser(user) {
  return {
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    studentId: user.studentId,
    source: user.source,
  };
}

export async function getAllLoginUsers() {
  const [defaultUsers, students] = await Promise.all([
    readLoginDatabase(),
    getAllStudents(),
  ]);

  const mergedByEmail = new Map();

  for (const user of buildStudentLoginAccounts(students)) {
    mergedByEmail.set(user.email, user);
  }

  for (const user of defaultUsers) {
    mergedByEmail.set(user.email, user);
  }

  return Array.from(mergedByEmail.values());
}

export async function getPublicLoginUsers() {
  const users = await getAllLoginUsers();
  return users.map(sanitiseUser);
}

export async function authenticateUser(email, password) {
  const users = await getAllLoginUsers();
  const normalisedEmail = String(email).trim().toLowerCase();
  const normalisedPassword = String(password);

  const user = users.find(
    (entry) => entry.email === normalisedEmail && entry.password === normalisedPassword
  );

  return user ? sanitiseUser(user) : null;
}
