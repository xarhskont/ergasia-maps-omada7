// layout.js
import { auth } from './firebase-config.js';
import {
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { db } from './firebase-config.js';

export async function loadHeader() {
    const header = document.getElementById('main-header');
    if (!header) {
        return;
    }

    const user = auth.currentUser;
    const brandPurple = '#7c3aed';

    let navLinks = '';
    let logoHref = '/index.html'; // Προεπιλογή: Αν δεν είσαι συνδεδεμένος, πας στο Welcome

    if (user) {
        const userInitial = (user.displayName || 'U').charAt(0).toUpperCase();
        let dashboardLink = '';
        let profilePath = '/pages/profile.html';
        let dashboardPath = '/pages/my-jobs.html';
        let role = null;

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                role = userDoc.data().role;
                dashboardPath =
                    role === 'employer' ? '/pages/employer-dashboard.html' : '/pages/my-jobs.html';

                if (role === 'employer') {
                    dashboardLink = `<li><a href="${dashboardPath}">My Jobs</a></li>
                                     <li><a href="/pages/create-job.html">Post a Job</a></li>`;
                    profilePath = '/pages/employer-profile.html';
                } else {
                    dashboardLink = `<li><a href="${dashboardPath}">Dashboard</a></li>`;
                    profilePath = '/pages/freelancer-profile.html';
                }
            }
        } catch (err) {
            console.error('Error fetching role for header:', err);
        }

        // 1η ΔΙΟΡΘΩΣΗ: Το λογότυπο λειτουργεί πλέον ως Home για τους συνδεδεμένους (πάει στο Dashboard)
        logoHref = dashboardPath;

        // Show Search link to non-employers only
        const searchLink =
            role === 'employer'
                ? ''
                : '<li><a href="/pages/freelancer-marketplace.html">Search</a></li>';

        // 2η ΔΙΟΡΘΩΣΗ: Αφαιρέθηκε το ελαττωματικό "Home" link. Έμειναν μόνο τα απαραίτητα.
        navLinks = `
            ${dashboardLink}
            ${searchLink}
            <li><a href="${profilePath}" title="Profile" style="display: flex; align-items: center; justify-content: center;">
                <div style="
                    width: 32px; 
                    height: 32px; 
                    background-color: ${brandPurple}; 
                    color: white; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: bold; 
                    font-size: 14px;
                    text-transform: uppercase;
                ">${userInitial}</div>
            </a></li>
        `;
    } else {
        // 3η ΔΙΟΡΘΩΣΗ: Όταν ο χρήστης ΔΕΝ είναι συνδεδεμένος, εμφανίζουμε ξανά το Login & Register όπως στο 1ο βίντεο
        navLinks = `
            <li><a href="/login.html">Login</a></li>
            <li><a href="/register.html">Register</a></li>
        `;
    }

    header.innerHTML = `
        <nav class="main-header">
            <a href="${logoHref}" class="brand-logo">Job&gt;inder</a>
            <ul class="nav-links">
                ${navLinks}
            </ul>
        </nav>
    `;
}

export function loadFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) {
        return;
    }

    footer.innerHTML = `
        <footer class="main-footer">
            <p>&copy; 2026 Job&gt;inder. All rights reserved.</p>
            <div style="margin-top: 10px; font-size: 0.8rem;">
                <a href="#" style="color: white; margin: 0 10px;">Terms of Service</a>
                <a href="#" style="color: white; margin: 0 10px;">Privacy Policy</a>
            </div>
        </footer>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();

    onAuthStateChanged(auth, () => {
        loadHeader();
    });
});
