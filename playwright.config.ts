import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Hydrate local variables if the file exists (will safely do nothing in CI)
dotenv.config();

const email = process.env.JIRA_USER_EMAIL;
const token = process.env.JIRA_API_TOKEN;
const baseUrl = process.env.JIRA_BASE_URL;

// Generate the authorization header safely only if variables are populated
const auth = email && token
    ? Buffer.from(`${email}:${token}`).toString('base64')
    : '';

export default defineConfig({
    testDir: './tests',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    reporter: 'html',
    use: {
        // Fallback guard ensures an empty string doesn't break path evaluation syntax
        baseURL: baseUrl ? `${baseUrl}/rest/api/3` : 'https://localhost/rest/api/3',
        extraHTTPHeaders: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    },
});
