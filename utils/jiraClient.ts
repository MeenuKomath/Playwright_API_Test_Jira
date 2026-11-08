import { APIRequestContext, APIResponse } from '@playwright/test';

export class JiraClient {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

   
    async createIssue(projectKey: string, summary: string, issueType: string = 'Task'): Promise<APIResponse> {
        return await this.request.post('/rest/api/3/issue', {
            data: {
                fields: {
                    project: { key: projectKey },
                    summary: summary,
                    issuetype: { name: issueType }
                }
            },
        });
    }

    async getIssue(issueKey: string): Promise<APIResponse> {
        return await this.request.get(`/rest/api/3/issue/${issueKey}`);
    }

    async updateIssue(issueKey: string, fields: object): Promise<APIResponse> {
        return await this.request.put(`/rest/api/3/issue/${issueKey}`, {
            data: { fields },
        });
    }

    async getTransitions(issueKey: string): Promise<APIResponse> {
        return await this.request.get(`/rest/api/3/issue/${issueKey}/transitions`);
    }

    async transitionIssue(issueKey: string, transitionId: string): Promise<APIResponse> {
        return await this.request.post(`/rest/api/3/issue/${issueKey}/transitions`, {
            data: { transition: { id: transitionId } },
        });
    }

    async deleteIssue(issueKey: string): Promise<APIResponse> {
        return await this.request.delete(`/rest/api/3/issue/${issueKey}`);
    }
}
