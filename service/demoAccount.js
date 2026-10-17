// Public demonstration identity; normal authentication is still required.
const demoEmail = 'test@example.com';
const protectedDemoEmails = [demoEmail, 'test1@example.com'];
const isDemoAccount = email => typeof email === 'string' && protectedDemoEmails.includes(email.trim().toLowerCase());
const credentialFields = ['email', 'password', 'confirmPassword', 'oldPassword', 'newPassword'];
module.exports = { demoEmail, protectedDemoEmails, isDemoAccount, credentialFields };
