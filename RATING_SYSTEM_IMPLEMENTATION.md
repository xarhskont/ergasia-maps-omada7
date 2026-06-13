# Implementation Detail: User Rating System

## 1. Overview

Implementation of a mutual rating system between Employers and Freelancers, integrated into the job lifecycle as specified in the PRD.

## 2. Database Schema (Cloud Firestore)

**Collection:** `reviews`
| Field | Type | Description |
| :--- | :--- | :--- |
| `jobId` | string | ID of the completed project |
| `reviewerId`| string | User ID of the person giving the rating |
| `revieweeId`| string | User ID of the person being rated |
| `rating` | number | Numerical score (1 to 5) |
| `comment` | string | Textual feedback |
| `type` | string | `employer_to_freelancer` or `freelancer_to_employer` |
| `createdAt` | timestamp| Date and time of submission |

## 3. Logic & Workflow

### 3.1 Trigger Condition

- A rating form is only accessible for a specific `jobId` once the job status is marked as **"completed"**.
- The system must verify that the `currentUser` is one of the two parties involved in that specific job.

### 3.2 Submission Process

- **Validation:** Ensure `rating` is between 1-5 and `comment` is not empty (if required).
- **Persistence:** Save the review document to the `reviews` collection using Firebase Modular SDK v9.
- **Uniqueness:** Prevent multiple reviews for the same job by the same user (Check if a document exists with both `jobId` and `reviewerId`).

### 3.3 Aggregation & Display

- **Average Calculation:**
  `Average Rating = Σ(all ratings for user) / count(all reviews for user)`
- **Profile Integration:**
    - Fetch all documents where `revieweeId == targetUserId`.
    - Calculate and display the mean score.
    - Render the list of reviews (comment, rating, and associated job).

## 4. Frontend Implementation (Vanilla JS/CSS)

### 4.1 Review Form Component

- **UI:** A set of 5 interactive stars and a `<textarea>` for comments.
- **Interaction:** Clicking a star sets the `rating` value.
- **Feedback:** Display a success toast/notification upon successful submission.

### 4.2 Profile View Component

- **Header:** Display the numeric average and a visual star representation.
- **List:** A scrollable list of review cards containing the reviewer's name, the rating, the comment, and the job reference.

## 5. Technical Constraints

- **Language:** All UI text and code comments in **English**.
- **Styling:** Responsive layout using **CSS Flexbox/Grid**.
- **Architecture:** No frameworks; use **Vanilla JavaScript (ES6+)**.
- **Backend:** **Firebase 9+ Modular SDK**.
