import { validateRegistration, calculateAverageRating, validateRatingValue, canChangeStatus, filterJobs, isOwner } from '../assets/js/validation.js';

describe('Registration Validation Tests', () => {
    test('should return error if fullName is missing', () => {
        const data = { fullName: '', email: 'test@example.com', password: 'password123', confirmPassword: 'password123', role: 'freelancer' };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Full name is required');
    });

    test('should return error if email is invalid', () => {
        const data = { fullName: 'John Doe', email: 'invalid-email', password: 'password123', confirmPassword: 'password123', role: 'freelancer' };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('A valid email is required');
    });

    test('should return error if passwords do not match', () => {
        const data = { fullName: 'John Doe', email: 'test@example.com', password: 'password123', confirmPassword: 'different123', role: 'freelancer' };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Passwords do not match');
    });

    test('should return error if role is missing', () => {
        const data = { fullName: 'John Doe', email: 'test@example.com', password: 'password123', confirmPassword: 'password123', role: '' };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('A user role must be selected');
    });

    test('should pass when all fields are valid', () => {
        const data = { fullName: 'John Doe', email: 'test@example.com', password: 'password123', confirmPassword: 'password123', role: 'freelancer' };
        const result = validateRegistration(data);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
    });
});

describe('Average Rating Calculation Tests', () => {
    test('should return 0.0 for zero reviews', () => {
        const reviews = [];
        expect(calculateAverageRating(reviews)).toBe('0.0');
    });

    test('should return the rating value for a single review', () => {
        const reviews = [{ rating: 5 }];
        expect(calculateAverageRating(reviews)).toBe('5.0');
    });

    test('should calculate the correct average for multiple reviews', () => {
        const reviews = [{ rating: 4 }, { rating: 5 }, { rating: 3 }];
        expect(calculateAverageRating(reviews)).toBe('4.0');
    });

    test('should handle decimal ratings correctly', () => {
        const reviews = [{ rating: 4.5 }, { rating: 3.8 }];
        expect(calculateAverageRating(reviews)).toBe('4.2');
    });
});

describe('Rating Value Validation', () => {
    test('should accept ratings between 1 and 5', () => {
        expect(validateRatingValue(1)).toBe(true);
        expect(validateRatingValue(3)).toBe(true);
        expect(validateRatingValue(5)).toBe(true);
    });

    test('should reject ratings outside 1-5 range', () => {
        expect(validateRatingValue(0)).toBe(false);
        expect(validateRatingValue(6)).toBe(false);
        expect(validateRatingValue(-1)).toBe(false);
        expect(validateRatingValue('5')).toBe(false);
    });
});

describe('Job Status Transition Tests', () => {
    test('should allow Open -> Assigned', () => {
        expect(canChangeStatus('open', 'assigned')).toBe(true);
    });

    test('should allow Assigned -> Completed', () => {
        expect(canChangeStatus('assigned', 'completed')).toBe(true);
    });

    test('should allow any status -> Cancelled', () => {
        expect(canChangeStatus('open', 'cancelled')).toBe(true);
        expect(canChangeStatus('assigned', 'cancelled')).toBe(true);
        expect(canChangeStatus('completed', 'cancelled')).toBe(true);
    });

    test('should forbid invalid transitions', () => {
        expect(canChangeStatus('open', 'completed')).toBe(false);
        expect(canChangeStatus('completed', 'open')).toBe(false);
    });
});

describe('Job Filtering Tests', () => {
    const mockJobs = [
        { id: 1, title: 'Job A', category: 'Web Development' },
        { id: 2, title: 'Job B', category: 'Graphic Design' },
        { id: 3, title: 'Job C', category: 'Web Development' },
    ];

    test('should filter jobs by category', () => {
        const criteria = { category: 'Web Development' };
        const result = filterJobs(mockJobs, criteria);
        expect(result.length).toBe(2);
        expect(result.every(job => job.category === 'Web Development')).toBe(true);
    });

    test('should return all jobs if criteria is empty', () => {
        expect(filterJobs(mockJobs, {})).toEqual(mockJobs);
        expect(filterJobs(mockJobs, null)).toEqual(mockJobs);
    });

    test('should return empty array for non-matching criteria', () => {
        const criteria = { category: 'Marketing' };
        expect(filterJobs(mockJobs, criteria).length).toBe(0);
    });
});

describe('Data Ownership Tests', () => {
    test('should return true if user IDs match', () => {
        expect(isOwner('user123', 'user123')).toBe(true);
    });

    test('should return false if user IDs do not match', () => {
        expect(isOwner('user123', 'user456')).toBe(false);
    });

    test('should return false if IDs are missing', () => {
        expect(isOwner(null, 'user123')).toBe(false);
        expect(isOwner('user123', null)).toBe(false);
    });
});
