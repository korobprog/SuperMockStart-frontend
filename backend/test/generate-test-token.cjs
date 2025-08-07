const jwt = require('jsonwebtoken');

// Секретный ключ из env.backend
const JWT_SECRET = 'your-secret-key-change-in-production';

// Создаем токен для кандидата из сессии test-session-1
const candidatePayload = {
  userId: 'cmdwhlz7n000155xsr3rs26ge', // ID кандидата из сессии
  username: 'candidateuser',
  firstName: 'Candidate',
  lastName: 'User',
  authType: 'telegram',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 дней
};

// Создаем токен для интервьюера из сессии test-session-1
const interviewerPayload = {
  userId: 'cmdwhlz6f000055xs6o315t3t', // ID интервьюера из сессии
  username: 'test_123456789',
  firstName: 'Test',
  lastName: 'User',
  authType: 'telegram',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 дней
};

const candidateToken = jwt.sign(candidatePayload, JWT_SECRET);
const interviewerToken = jwt.sign(interviewerPayload, JWT_SECRET);

console.log('=== Test Tokens ===');
console.log('\nCandidate Token:');
console.log(candidateToken);
console.log('\nInterviewer Token:');
console.log(interviewerToken);

console.log('\n=== Token Details ===');
console.log('\nCandidate Payload:');
console.log(JSON.stringify(candidatePayload, null, 2));
console.log('\nInterviewer Payload:');
console.log(JSON.stringify(interviewerPayload, null, 2));
