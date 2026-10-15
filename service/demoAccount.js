// Public demonstration identity; normal authentication is still required.
const demoEmail = 'test1@example.com';
const isDemoAccount = email => typeof email === 'string' && email.trim().toLowerCase() === demoEmail;
const credentialFields = ['email', 'password', 'confirmPassword', 'oldPassword', 'newPassword'];
module.exports = { demoEmail, isDemoAccount, credentialFields };
