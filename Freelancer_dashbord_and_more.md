# Implementation Detail: Freelancer Workflow Focus

## 1. Overview

Implementation of the Freelancer-specific workflows, integrating with the existing Authentication and Review systems (handled by other team members). The focus is exclusively on job discovery, the application process, and work submission.

## 2. Database Schema (Cloud Firestore - Freelancer Focus)

| Collection     | Freelancer Interactions              | Purpose                                      |
| :------------- | :----------------------------------- | :------------------------------------------- |
| `users`        | Read profile, Update skills          | Manage freelancer identity and expertise.    |
| `jobs`         | Query open jobs, Update to submitted | Find work and mark as complete.              |
| `applications` | Create new proposals                 | Link Freelancer `uid` to a specific `jobId`. |
| `reviews`      | Read received reviews                | Display reputation on profile.               |

## 3. Focused Phased Logic

### 3.1 Phase 1: Profile & Integration

- **Integration:** Connect with the existing Auth system to identify the user as a freelancer.
- **Profile Management:**
    - **UI:** Dedicated profile page for freelancers.
    - **Logic:** Update skills, bio, and portfolio links in the `users` collection.

### 3.2 Phase 2: Job Discovery (The Marketplace)

- **Job Feed:**
    - **UI:** Searchable and filterable list of available jobs.
    - **Logic:** Query Firestore for jobs where `status == 'open'`.
- **Job Details:**
    - **UI:** Detailed view showing budget, deadline, and employer requirements.

### 3.3 Phase 3: Application & Submission Workflow

- **Applying for Work:**
    - **UI:** Application form (proposal text, estimated time).
    - **Logic:** Create document in `applications` linking Freelancer `uid` and `jobId`.
- **Active Jobs Dashboard:**
    - **UI:** "My Jobs" section showing status (applied, assigned, submitted).
- **Delivery System:**
    - **UI:** Submission portal for assigned jobs. (Note: All interactions and deliverables are asynchronous; no live calls or video functionality are required).
    - **Logic:** Upload deliverable to Firebase Storage; update job status to `submitted`.

## 4. Frontend Implementation (Vanilla JS/CSS)

- **Role-Based UI:** Ensure the interface only reveals freelancer-specific options.
- **Responsive Layout:** Optimized views for browsing jobs on mobile and uploading files on desktop.
- **UX Feedback:** Toast notifications for successful applications and submissions.

## 5. Technical Constraints & Verification

- **Language:** All UI and code in English.
- **Architecture:** Vanilla JavaScript (ES6+) and Firebase 9+ Modular SDK.
- **E2E Testing:** Search Job → Apply → (Wait for Assign) → Submit Deliverable.
- **UI Audit:** Responsive check for the Job Marketplace and Submission forms.
