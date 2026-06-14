/**
 * Validates registration form data
 * @param {Object} data - The registration data { fullName, email, password, confirmPassword, role }
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateRegistration(data) {
    const errors = [];
    const { fullName, email, password, confirmPassword, role } = data;

    if (!fullName || fullName.trim() === '') {
        errors.push('Full name is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('A valid email is required');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (password !== confirmPassword) {
        errors.push('Passwords do not match');
    }

    if (!role || role === '') {
        errors.push('A user role must be selected');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Calculates the average rating from a list of reviews
 * @param {Array} reviews - List of review objects { rating: number, ... }
 * @returns {string} - Average rating formatted to 1 decimal place
 */
export function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) {
        return '0.0';
    }
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
}

/**
 * Validates if a rating value is within the allowed range (1-5)
 * @param {number} rating 
 * @returns {boolean}
 */
export function validateRatingValue(rating) {
    return typeof rating === 'number' && rating >= 1 && rating <= 5;
}

/**
 * Determines if a job status transition is allowed
 * @param {string} currentStatus 
 * @param {string} nextStatus 
 * @returns {boolean}
 */
export function canChangeStatus(currentStatus, nextStatus) {
    if (nextStatus === 'cancelled') {return true;}
    if (currentStatus === 'open' && nextStatus === 'assigned') {return true;}
    if (currentStatus === 'assigned' && nextStatus === 'completed') {return true;}
    return false;
}

/**
 * Filters a list of jobs based on criteria
 * @param {Array} jobs 
 * @param {Object} criteria { category: string }
 * @returns {Array}
 */
export function filterJobs(jobs, criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {return jobs;}
    return jobs.filter(job => {
        return Object.keys(criteria).every(key => job[key] === criteria[key]);
    });
}

/**
 * Checks if the current user is the owner of the profile
 * @param {string} currentUserId 
 * @param {string} profileId 
 * @returns {boolean}
 */
export function isOwner(currentUserId, profileId) {
    if (!currentUserId || !profileId) {return false;}
    return currentUserId === profileId;
}
