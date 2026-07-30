// Generates an ADMIN_PASSWORD_HASH for the admin login.
// Usage:  npm run hash-password
// Prompts for a password (hidden) and prints the scrypt verifier string to
// paste into ADMIN_PASSWORD_HASH (env). The plaintext is never stored or logged.
//
// Verifier format:  scrypt$N$r$p$<saltHex>$<hashHex>
import { scryptSync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';

// scrypt cost params (must match api/_lib/password.ts)
const N = 16384; // 2^14
const r = 8;
const p = 1;
const KEYLEN = 32;

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    // Hide typed characters.
    const stdout = process.stdout;
    rl._writeToOutput = (str) => {
      if (str.includes(question)) stdout.write(str);
      // otherwise suppress echo of the password
    };
    rl.question(question, (answer) => {
      rl.close();
      stdout.write('\n');
      resolve(answer);
    });
  });
}

const pw = (await ask('Enter admin password: ')).trim();
if (pw.length < 10) {
  console.error('\nRefusing: use a password of at least 10 characters.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(pw, salt, KEYLEN, { N, r, p });
const verifier = `scrypt$${N}$${r}$${p}$${salt.toString('hex')}$${hash.toString('hex')}`;

console.log('\nADMIN_PASSWORD_HASH=' + verifier);
console.log('\nAdd that line to your .env (local) and to Vercel env settings.');
