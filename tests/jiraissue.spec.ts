import { test, expect } from '@playwright/test';
import { JiraClient } from '../utils/jiraClient';

test.describe.configure({ mode: 'serial' }); // Enforces sequential execution order
test.describe('Jira Issue API - Isolated Operation Validation', () => {

    let jira: JiraClient;
    let createdIssueKey: string;
    const projectKey = process.env.JIRA_PROJECT_KEY;
    const localDateTime: string = new Date().toLocaleString();
    const baselineSummary = `Playwright Automated Test - ${localDateTime}`;
    const updatedSummary = `Playwright Automated Updated Test - ${localDateTime}`;

    test.beforeEach(async ({ request }) => {
        jira = new JiraClient(request);
    });

    test('TC - 01: POST - Create Jira Issue', async () => {


        const createRes = await jira.createIssue(projectKey, baselineSummary, 'Task');
        expect(createRes.status()).toBe(201);
        expect(createRes.ok()).toBeTruthy();
        const createBody = await createRes.json();
        createdIssueKey = createBody.key;
        expect(createBody).toHaveProperty('id');
        expect(createBody).toHaveProperty('key');
        expect(createBody).toHaveProperty('self');

        // Type and value assertions
        expect(typeof createBody.id).toBe('string');
        expect(createBody.key).toMatch(new RegExp(`^${projectKey}`));
        expect(createBody.self).toContain(`atlassian.net/rest/api/3/issue/${createBody.id}`);

        console.log(`POST Issue generated successfully, Created issue ticket: ${createdIssueKey}`);
    });
    test('TC - 02: GET - Read Issue State', async () => {
        // Ensure the previous test passed and created the issue
        test.skip(!createdIssueKey, 'Skipping GET test: Issue key context was not created.');

        const response = await jira.getIssue(createdIssueKey);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.fields.project.key).toBe(projectKey);
        expect(body.fields.summary).toBe(baselineSummary);
        expect(body.fields.status.name).toBe('To Do');

        console.log(`GET -Issue generated successfully,Name and Summary:  ${body.fields.status.name} - ${body.fields.summary} `);
    });
    test('TC - 03: PUT - Update Issue Fields', async () => {

        test.skip(!createdIssueKey, 'Skipping PUT test: Issue key context was not created.');

        const response = await jira.updateIssue(createdIssueKey, { summary: updatedSummary });
        expect(response.status()).toBe(204);

        // API verification check to verify update persistence
        const verifyRes = await jira.getIssue(createdIssueKey);
        const verifyBody = await verifyRes.json();
        expect(verifyBody.fields.summary).toBe(updatedSummary);

        console.log(`PUT - Issue updated successfully, New Summary: ${verifyBody.fields.summary}`);
    });

    test('TC - 04: DELETE - Delete Issue', async () => {

        test.skip(!createdIssueKey, 'Skipping DELETE  test: Issue key context was not created.');

        const deleteRes = await jira.deleteIssue(createdIssueKey);
        expect(deleteRes.status()).toBe(204); // Jira returns 204 No Content on successful deletion
        // Confirm resource is gone (Should return 404 Not Found now)
        const postDeleteCheck = await jira.getIssue(createdIssueKey);
        expect(postDeleteCheck.status()).toBe(404);

        console.log(`DELETE - Issue deleted successfully`);
    });
});
