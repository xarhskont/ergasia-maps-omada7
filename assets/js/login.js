import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { loadHeader, loadFooter } from './layout.js';

loadHeader();
loadFooter();

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button');

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Logging in...';

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;
            alert(`Welcome back, ${userData.fullName}!`);
            
            // ΔΙΟΡΘΩΣΗ: Προστέθηκε το αρχικό '/' για να μη σπάει ποτέ η διαδρομή
            if (role === 'employer') {
                window.location.href = '/pages/employer-dashboard.html'; 
            } else {
                window.location.href = '/pages/freelancer-marketplace.html';
            }

        } else {
            throw new Error('User profile not found in database.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(`Login Failed: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Login';
    }
});