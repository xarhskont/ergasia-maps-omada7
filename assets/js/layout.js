// layout.js
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { db } from './firebase-config.js';

export async function loadHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const user = auth.currentUser;
    const userInitial = user ? (user.displayName || 'U').charAt(0).toUpperCase() : 'U';
    const brandPurple = '#7c3aed';

    let navLinks = '';
    if (user) {
        let dashboardLink = '';
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                const dashboardPath = role === 'employer' ? '/pages/employer-dashboard.html' : '/pages/freelancer-dashboard.html';
                dashboardLink = `<li><a href="${dashboardPath}">Dashboard</a></li>`;
            }
        } catch (err) {
            console.error("Error fetching role for header:", err);
        }

        navLinks = `
            <li><a href="/index.html">Home</a></li>
            ${dashboardLink}
            <li><a href="/pages/search.html">Search</a></li>
            <li><a href="/pages/profile.html" title="Profile" style="display: flex; align-items: center; justify-content: center;">
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
        navLinks = ''; 
    }

    header.innerHTML = `
        <nav class="main-header">
            <a href="/index.html" class="brand-logo">Job&gt;inder</a>
            <ul class="nav-links">
                ${navLinks}
            </ul>
        </nav>
    `;
}

export function loadFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;

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
    // Initial load
    loadHeader();
    loadFooter();

    // Listen for auth state changes to update header dynamically
    onAuthStateChanged(auth, () => {
        loadHeader();
    });
});


