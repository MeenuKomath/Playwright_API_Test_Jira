# Jira API Test Automation Framework

A modular, enterprise-grade API test automation framework built with **Playwright (TypeScript)** using the **Page Object Model (POM)** pattern. This framework validates the full lifecycle of Jira cloud issues (Create, Read, Update, Transition, and Delete) and runs automatically on every commit via **GitHub Actions**.

---

## 🚀 Key Features

* **True API Isolation:** Utilizes Playwright's native `APIRequestContext` for lightning-fast backend validation without the overhead of browser UIs.
* **Page Object Model (POM):** Clean decoupling of test specs from API client configurations (`JiraClient`).
* **Environment Security:** Zero hardcoded credentials. Dynamic loading via `dotenv` locally and secured injection via GitHub Secrets in CI/CD.
* **Dynamic Workflow Transitions:** Automatically inspects available Jira project workflow paths at runtime to transition tickets reliably.
* **Resilient Assertions:** Enforces sequential test execution (`serial` mode) to validate chronological state persistence down to database layers.

---

## 🛠️ Project Structure

```text
├── .github/workflows/
│   └── playwright.yml       # GitHub Actions CI/CD Pipeline Configuration
├── tests/
│   └── jiraissue.spec.ts    # E2E Issue Lifecycle API Test Suite
├── utils/
│   └── jiraClient.ts        # Modular Jira API Interaction Client (POM)
├── .env.example             # Template for local environment variables
├── .gitignore               # Excludes secrets and node_modules from Git
├── playwright.config.ts     # Global Playwright configuration & baseURL engine
├── package.json             # Scripts and dependencies management
└── README.md                # Framework Documentation
```

---

## 💻 Local Setup & Execution

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (LTS version) installed.

### 2. Clone and Install Dependencies
```bash
git clone <your-repository-url>
cd Playwright_API_Test_Jira
npm install
```

### 3. Configure Local Environment Variables
Create a file named `.env` in the root directory:
```bash
touch .env
```

Add your specific configuration values (replace with your personal Atlassian tokens **without** quotation marks):
```env
JIRA_DOMAIN=meenu-komath
JIRA_EMAIL=123meenukomath@gmail.com
JIRA_TOKEN=your_jira_api_token_here
JIRA_PROJECT_KEY=KAN
```

### 4. Run Tests Locally
```bash
# Run all tests sequentially
npx playwright test
```

---

## 🤖 CI/CD Pipeline (GitHub Actions)

This project features an optimized GitHub Actions workflow (`.github/workflows/playwright.yml`) that triggers automatically on every push or pull request to the `main` or `master` branches.

### Workflow Optimization
Because this is a dedicated API testing framework, the CI pipeline is customized to **skip browser downloads** (`npx playwright install`). This decreases pipeline spin-up execution time significantly.

### Configuring GitHub Secrets
To allow the pipeline to communicate with your Jira Cloud instance securely, you must register your `.env` variables as repository secrets:

1. Navigate to your repository on GitHub.
2. Go to **Settings** ⚙️ → **Secrets and variables** → **Actions**.
3. Click **New repository secret** and add the following four secrets:

| Secret Name | Value Example |
| :--- | :--- |
| `JIRA_DOMAIN` | `meenu-komath` |
| `JIRA_EMAIL` | `123meenukomath@gmail.com` |
| `JIRA_TOKEN` | *Your secret Atlassian API Token* |
| `JIRA_PROJECT_KEY` | `KAN` |

### Post-Execution Artifacts
If any test operations fail in the cloud, Playwright is configured to retain failure traces, screenshots, and logs. GitHub Actions automatically packages these into a zip folder named `playwright-report` visible at the bottom of your workflow execution summaries for easy local debugging.
