// rating.js
import { db, auth } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/**
 * Submits a rating for a user
 * @param {string} jobId - The ID of the job
 * @param {string} revieweeId - The ID of the user being rated
 * @param {number} rating - Rating 1-5
 * @param {string} comment - Feedback text
 * @param {string} type - 'employer_to_freelancer' or 'freelancer_to_employer'
 */
export async function submitRating(jobId, revieweeId, rating, comment, type) {
    const user = auth.currentUser;
    if (!user) throw new Error("User must be authenticated to submit a rating");

    try {
        const reviewsRef = collection(db, 'reviews');
        await addDoc(reviewsRef, {
            jobId: jobId,
            reviewerId: user.uid,
            revieweeId: revieweeId,
            rating: rating,
            comment: comment,
            type: type,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error("Error submitting rating: ", error);
        throw error;
    }
}

/**
 * Fetches all reviews for a specific user and calculates average
 * @param {string} userId - The ID of the user to fetch reviews for
 */
export async function getUserRatings(userId) {
    try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where("revieweeId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const reviews = [];
        let totalRating = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            reviews.push({ id: doc.id, ...data });
            totalRating += data.rating;
        });

        const average = reviews.length > 0 ? totalRating / reviews.length : 0;

        return {
            average: average.toFixed(1),
            totalReviews: reviews.length,
            reviews: reviews.sort((a, b) => b.createdAt - a.createdAt)
        };
    } catch (error) {
        console.error("Error fetching ratings: ", error);
        throw error;
    }
}
