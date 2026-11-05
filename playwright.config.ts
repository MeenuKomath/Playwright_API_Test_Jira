import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// Encode Email and API Token to Base64 for Jira Basic Authentication
const auth = Buffer.from(
    `${process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`
).toString('base64');

export default defineConfig({
    testDir: './tests',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    reporter: 'html',
    use: {
        baseURL: `${process.env.JIRA_BASE_URL}/rest/api/3`,
        extraHTTPHeaders: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    },
});
