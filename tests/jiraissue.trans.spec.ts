import { test, expect } from '@playwright/test';
import { JiraClient } from '../utils/jiraClient';

test.describe.configure({ mode: 'serial' });

test.describe('Jira Issue Transient Tests', () => {
    let jira: JiraClient;
    let createdIssueKey: string;

    const projectKey = process.env.JIRA_PROJECT_KEY || 'KAN';
    const localDateTime: string = new Date().toLocaleString();
    const baselineSummary = `Playwright Automated Test Transition - ${localDateTime}`;

    test.beforeEach(async ({ request }) => {
        jira = new JiraClient(request);
    });

    test('TC 1 - Create an issue and validate Issue is in To Do state', async () => {

        const createRes = await jira.createIssue(projectKey, baselineSummary, 'Task');
        expect(createRes.status()).toBe(201);

        const createBody = await createRes.json();
        createdIssueKey = createBody.key;
        console.log(`Issue Created: ${createdIssueKey}`);

        const response = await jira.getIssue(createdIssueKey);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.fields.status.name).toBe('To Do');

        console.log(`Issue in To Do State: ${body.fields.status.name}`);
    });

    test('TC - 2 Perform transition and validate Issue is in In Progress state', async () => {

        expect(createdIssueKey).toBeDefined();

        const availableTransRes = await jira.getTransitions(createdIssueKey);
        expect(availableTransRes.status()).toBe(200);
        const transData = await availableTransRes.json();

        
        const inProgressTransition = transData.transitions.find((t: any) => t.name === 'In Progress');
        expect(inProgressTransition, `Transition 'In Progress' is unavailable.`).toBeDefined();

        const targetTransitionId = inProgressTransition.id;
        console.log(`Found Dynamic Transition ID for 'In Progress': ${targetTransitionId}`);

       
        const responseTrans = await jira.transitionIssue(createdIssueKey, targetTransitionId);
        expect(responseTrans.status()).toBe(204);

        
        const response = await jira.getIssue(createdIssueKey);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.fields.status.name).toBe('In Progress');

        console.log(`Issue in In Progress State: ${body.fields.status.name}`);
    });

    test('TC - 3 Perform transition and validate Issue is in Done state', async () => {
        expect(createdIssueKey).toBeDefined();

       
        const availableTransRes = await jira.getTransitions(createdIssueKey);
        expect(availableTransRes.status()).toBe(200);
        const transData = await availableTransRes.json();

       
        const doneTransition = transData.transitions.find((t: any) => t.name === 'Done');
        expect(doneTransition, `Transition 'Done' is unavailable from current state.`).toBeDefined();

      
        const responseTrans = await jira.transitionIssue(createdIssueKey, doneTransition.id);
        expect(responseTrans.status()).toBe(204);

     
        const response = await jira.getIssue(createdIssueKey);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.fields.status.name).toBe('Done');

        console.log(`Issue is in Done State: ${body.fields.status.name}`);
    });
});
