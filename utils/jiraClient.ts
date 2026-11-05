import { APIRequestContext, APIResponse } from '@playwright/test';

export class JiraClient {
    private request: APIRequestContext;
    private baseUrl: string;
    private authHeader: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        const domain = process.env.JIRA_DOMAIN;
        const email = process.env.JIRA_EMAIL;
        const token = process.env.JIRA_TOKEN;

        this.baseUrl = `https://${domain}.atlassian.net/rest/api/3`;
        const credentials = Buffer.from(`${email}:${token}`).toString('base64');
        this.authHeader = `Basic ${credentials}`;
    }

    async createIssue(projectKey: string, summary: string, issueType: string = 'Task'): Promise<APIResponse> {
        return await this.request.post(`${this.baseUrl}/issue`, {
            headers: { 'Authorization': this.authHeader, 'Content-Type': 'application/json' },
            data: { fields: { project: { key: projectKey }, summary: summary, issuetype: { name: issueType } } },
        });
    }

    async getIssue(issueKey: string): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}/issue/${issueKey}`, {
            headers: { 'Authorization': this.authHeader, 'Accept': 'application/json' },
        });
    }

    /**
     * PUT: Updates an entire issue or specific field structures.
     * Jira's Edit Issue API expects fields to be wrapped in a "fields" object.
     * @param issueKey The Jira issue key (e.g., 'KAN-1')
     * @param fields The fields to update (e.g., { summary: 'New Summary' })
     */
    async updateIssue(issueKey: string, fields: object): Promise<APIResponse> {
        return await this.request.put(`${this.baseUrl}/issue/${issueKey}`, {
            headers: {
                'Authorization': this.authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: { fields },
        });
    }
    /**
     * GET: Fetches all available workflow transitions for a specific issue.
     * @param issueKey The Jira issue key (e.g., 'KAN-11')
     */
    async getTransitions(issueKey: string): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}/issue/${issueKey}/transitions`, {
            headers: {
                'Authorization': this.authHeader,
                'Accept': 'application/json'
            },
        });
    }

    /**
     * PATCH/POST Workflow Transitions: Jira uses POST requests against the `/transitions` endpoint 
     * to modify issue status workflow tracks (e.g., moving a ticket from "To Do" to "In Progress").
     * @param issueKey The Jira issue key (e.g., 'KAN-1')
     * @param transitionId The unique ID of the target status transition
     */
    async transitionIssue(issueKey: string, transitionId: string): Promise<APIResponse> {
        return await this.request.post(`${this.baseUrl}/issue/${issueKey}/transitions`, {
            headers: {
                'Authorization': this.authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                transition: { id: transitionId }
            },
        });
    }

    async deleteIssue(issueKey: string): Promise<APIResponse> {
        return await this.request.delete(`${this.baseUrl}/issue/${issueKey}`, {
            headers: { 'Authorization': this.authHeader },
        });
    }
}
