# Automated Testing Specification

## 1. Registration Validation

- [ ] **Empty Fields:** Ensure registration fails when required fields (full name, email, password, role) are missing.
- [ ] **Email Format:** Validate that emails follow the standard `username@domain.com` pattern using regex.
- [ ] **Password Match:** Ensure password and confirm password fields are identical.
- [ ] **Email Uniqueness:** (Integration) Verify that a user cannot register with an email that already exists in the database.

## 2. Rating System

- [ ] **Authorization:** Verify that only the correct party can submit a rating (e.g., employer ratings freelancer and vice versa).
- [ ] **Rating Uniqueness:** Ensure a user cannot submit multiple ratings for the same job.
- [ ] **Job Completion Status:** Verify that ratings are only permitted when the job status is `completed`.
- [ ] **Rating Range:** Ensure the rating value is strictly between 1 and 5.

## 3. Job State Management

- [ ] **Assignment Logic:** Verify that a job can be assigned ONLY if its current status is `open`.
- [ ] **Cancellation Logic:** Ensure that cancelling a job correctly updates the status to `cancelled`.
- [ ] **State Transitions:** Verify the correct lifecycle flow: `Open` -> `Assigned` -> `Completed`.

## 4. Search and Calculations

- [ ] **Job Filtering:** Verify that filtering by category or other criteria returns the expected set of jobs.
- [ ] **Average Rating Calculation:**
    - [ ] Zero ratings -> Average: 0.
    - [ ] Single rating -> Average: rating value.
    - [ ] Multiple ratings -> Accurate mathematical mean calculation.

## 5. Session and Security

- [ ] **Logout Verification:** Ensure that the logout function correctly terminates the Firebase session and redirects the user to the login page.
- [ ] **Data Ownership (Profile Access):** Verify that a user can only access and edit their own profile data.
- [ ] **Unauthorized Access:** Ensure that attempting to access a profile using another user's UID results in an error or redirection.
