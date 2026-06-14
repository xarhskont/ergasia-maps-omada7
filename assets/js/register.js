import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import {
    doc,
    setDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { loadHeader, loadFooter } from './layout.js';
import { validateRegistration } from './validation.js';

loadHeader();
loadFooter();

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        role: document.getElementById('role').value,
    };

    const validation = validateRegistration(data);
    if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return;
    }

    const submitBtn = registerForm.querySelector('button');

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Creating Account...';

        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // 2. Create user profile in Firestore
        await setDoc(doc(db, 'users', uid), {
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            bio: '',
            skills: [],
            averageRating: 0,
            totalReviews: 0,
            createdAt: serverTimestamp(),
            photoURL: ''
        });

        alert('Account created successfully!');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Registration error:', error);
        alert(`Registration Failed: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Create Account';
    }
});
