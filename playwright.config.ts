import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.JIRA_EMAIL;
const token = process.env.JIRA_TOKEN;
const domain = process.env.JIRA_DOMAIN;

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
     
        baseURL: domain
            ? `https://${domain}.atlassian.net/rest/api/3/` // Added trailing slash
            : 'https://localhost/rest/api/3/',

        extraHTTPHeaders: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },

        // Artifacts configurations (Optimized for troubleshooting failures)
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
});
