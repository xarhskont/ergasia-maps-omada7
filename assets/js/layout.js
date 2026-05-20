// layout.js
import { auth } from './firebase-config.js';

export function loadHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const user = auth.currentUser;
    const userInitial = user ? (user.displayName || 'U').charAt(0).toUpperCase() : 'U';
    const brandPurple = '#7c3aed';

    header.innerHTML = `
        <nav class="main-header">
            <a href="/index.html" class="brand-logo">Job&gt;inder</a>
            <ul class="nav-links">
                <li><a href="/index.html">Home</a></li>
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
    loadHeader();
    loadFooter();
});


