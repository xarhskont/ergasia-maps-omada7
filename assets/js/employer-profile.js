import { auth, db } from '/assets/js/firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { loadHeader, loadFooter } from '/assets/js/layout.js';
import { getUserRatings } from '/assets/js/rating.js';

loadHeader();
loadFooter();

const profileForm = document.getElementById('profile-form');

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = '/login.html';
    } else {
        loadEmployerData(user);
    }
});

async function loadEmployerData(user) {
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('display-name').value = data.fullName || ''; 
            document.getElementById('bio').value = data.bio || '';
        }
    } catch (err) {
        console.error("Error loading profile:", err);
    }

    try {
        const ratings = await getUserRatings(user.uid);
        document.getElementById('avg-rating').innerText = ratings.average;
        document.getElementById('total-reviews').innerText = `(${ratings.totalReviews} reviews)`;
        document.getElementById('reviews-list').innerHTML = ratings.reviews.map(r => `
            <div class="review-card">
                <strong>${r.rating} ★</strong>
                <p>${r.comment}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading reviews:", err);
    }
}

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const updatedData = {
        fullName: document.getElementById('display-name').value, 
        bio: document.getElementById('bio').value,
        updatedAt: new Date()
    };

    try {
        await updateDoc(doc(db, "users", user.uid), updatedData);
        alert("Profile updated successfully!");
    } catch (err) {
        alert("Error updating profile: " + err.message);
    }
});

document.getElementById('logout-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.href = "/index.html";
    } catch (err) {
        alert("Error during logout: " + err.message);
    }
});
