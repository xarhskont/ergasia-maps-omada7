import { submitRating, getUserRatings } from '../assets/js/rating.js';
import { auth } from '../assets/js/firebase-config.js';

// Mocking Firebase Auth
jest.mock('../assets/js/firebase-config.js', () => ({
    auth: {
        currentUser: { uid: 'user_123', email: 'test@test.com' }
    },
    db: {}
}));

// Mocking the entire Firebase JS SDK module to avoid network requests and import errors
jest.mock(
    '../assets/js/firebase-config.js',
    () => ({
        auth: {
            currentUser: { uid: 'user_123', email: 'test@test.com' }
        },
        db: {}
    }),
    { virtual: true }
);

// We mock the Firestore functions by overriding the imports in the target file
// Since we use ES modules, we will mock the functions using jest.mock on the firestore module
jest.mock(
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js',
    () => ({
        collection: jest.fn(),
        addDoc: jest.fn(),
        query: jest.fn(),
        where: jest.fn(),
        getDocs: jest.fn()
    }),
    { virtual: true }
);

import { getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

describe('Rating System Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should block rating if user is not authenticated', async () => {
        auth.currentUser = null;
        await expect(
            submitRating('job_abc', 'user_xyz', 5, 'Great!', 'employer_to_freelancer')
        ).rejects.toThrow('User must be authenticated to submit a rating');
        auth.currentUser = { uid: 'user_123' };
    });

    test('should block rating if a review already exists for this job', async () => {
        getDocs.mockResolvedValue({
            empty: false,
            forEach: () => {}
        });

        await expect(
            submitRating('job_abc', 'user_xyz', 5, 'Great!', 'employer_to_freelancer')
        ).rejects.toThrow('You have already submitted a rating for this job.');
    });

    test('should allow rating if no previous review exists', async () => {
        getDocs.mockResolvedValue({
            empty: true,
            forEach: () => {}
        });
        addDoc.mockResolvedValue({ id: 'review_1' });

        const result = await submitRating(
            'job_abc',
            'user_xyz',
            5,
            'Great!',
            'employer_to_freelancer'
        );
        expect(result.success).toBe(true);
        expect(addDoc).toHaveBeenCalled();
    });

    test('should correctly fetch and calculate average ratings for a user', async () => {
        const mockReviews = [
            { data: () => ({ rating: 5 }) },
            { data: () => ({ rating: 4 }) },
            { data: () => ({ rating: 3 }) }
        ];

        getDocs.mockResolvedValue({
            empty: false,
            forEach: (callback) => mockReviews.forEach(callback)
        });

        const result = await getUserRatings('user_xyz');
        expect(result.average).toBe('4.0');
        expect(result.totalReviews).toBe(3);
    });
});
