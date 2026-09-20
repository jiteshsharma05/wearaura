const fs = require('fs');
const https = require('https');
const path = require('path');

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("Please set SUPABASE_ACCESS_TOKEN environment variable.");
  process.exit(1);
}
const projectRef = "txxtnsvlnubitcotiqee";

const t1 = fs.readFileSync(path.join(__dirname, 'template_1_extracted.html'), 'utf-8');
const t2 = fs.readFileSync(path.join(__dirname, 'template_2_extracted.html'), 'utf-8');
const t3 = fs.readFileSync(path.join(__dirname, 'template_3_extracted.html'), 'utf-8');
const t4 = fs.readFileSync(path.join(__dirname, 'template_4_extracted.html'), 'utf-8');

const payload = {
  mailer_otp_length: 6,
  mailer_otp_exp: 600,
  mailer_subjects_magic_link: "{{ .Token }} is your WearAura sign-in code",
  mailer_templates_magic_link_content: t1,
  mailer_subjects_confirmation: "Welcome to WearAura — Confirm your account",
  mailer_templates_confirmation_content: t2,
  mailer_subjects_recovery: "Reset your WearAura password",
  mailer_templates_recovery_content: t3,
  mailer_subjects_email_change: "Confirm email address change — WearAura",
  mailer_templates_email_change_content: t4
};

const data = JSON.stringify(payload);

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${projectRef}/config/auth`,
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Sending PATCH request to Supabase API...');
const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(`Status code: ${res.statusCode}`);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const parsed = JSON.parse(body);
      console.log('Successfully updated Supabase auth configuration and templates!');
      console.log('mailer_otp_length:', parsed.mailer_otp_length);
      console.log('mailer_otp_exp:', parsed.mailer_otp_exp);
      console.log('mailer_subjects_magic_link:', parsed.mailer_subjects_magic_link);
      console.log('mailer_subjects_confirmation:', parsed.mailer_subjects_confirmation);
      console.log('mailer_subjects_recovery:', parsed.mailer_subjects_recovery);
      console.log('mailer_subjects_email_change:', parsed.mailer_subjects_email_change);
    } else {
      console.error('Error response:', body);
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err);
});

req.write(data);
req.end();
