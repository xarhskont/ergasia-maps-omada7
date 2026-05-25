import { auth, db } from '/assets/js/firebase-config.js';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { loadHeader, loadFooter } from '/assets/js/layout.js';

loadHeader();
loadFooter();

const jobsGrid = document.getElementById('jobs-grid');
const statusFilters = document.getElementById('status-filters');
const welcomeText = document.getElementById('employer-welcome');

async function initDashboard() {
    const user = auth.currentUser;
    if (!user) {
        jobsGrid.innerHTML = '<p class="empty-msg">Please log in to view your jobs.</p>';
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            welcomeText.innerText = `Welcome back, ${userData.fullName}!`;
        } else {
            welcomeText.innerText = 'Welcome back!';
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        welcomeText.innerText = 'Welcome back!';
    }

    await fetchJobs();
}

async function fetchJobs(statusFilter = 'all') {
    const user = auth.currentUser;
    if (!user) return;

    try {
        let q = query(collection(db, 'jobs'), where('employerId', '==', user.uid));
        
        if (statusFilter !== 'all') {
            q = query(collection(db, 'jobs'), where('employerId', '==', user.uid), where('status', '==', statusFilter));
        }

        const querySnapshot = await getDocs(q);
        jobsGrid.innerHTML = '';

        if (querySnapshot.empty) {
            jobsGrid.innerHTML = '<p class="empty-msg">No jobs found for this category.</p>';
            return;
        }

        querySnapshot.forEach((jobDoc) => {
            const job = jobDoc.data();
            const id = jobDoc.id;
            
            const card = document.createElement('div');
            card.className = 'tracker-card';
            card.innerHTML = `
                <div class="tracker-header">
                    <h3>${job.title}</h3>
                    <span class="status-badge ${job.status}">${job.status}</span>
                </div>
                <div style="color: var(--secondary-color); font-size: 0.9rem; margin-bottom: 1rem;">
                    Budget: <span style="color: var(--success-color); font-weight: bold;">$${job.budget}</span> | Deadline: ${job.deadline}
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    ${job.status === 'open' ? `<a href="/pages/job-applications?id=${id}" class="btn-submit-work" style="flex: 1; text-align: center; padding: 12px 0; font-weight: 600;">View Applications</a>` : ''}
                    <button class="btn-delete" id="del-${id}" style="background: var(--error-color); color: white; border: none; border-radius: 6px; cursor: pointer; padding: 12px 15px; font-weight: 600;">Delete</button>
                </div>
            `;
            jobsGrid.appendChild(card);

            // Ασφαλής λειτουργία Delete
            document.getElementById(`del-${id}`).addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
                    try {
                        await deleteDoc(doc(db, 'jobs', id));
                        alert('Job deleted successfully!');
                        fetchJobs(statusFilter); // Ανανεώνει τη λίστα αυτόματα
                    } catch (err) {
                        alert('Error deleting job: ' + err.message);
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        jobsGrid.innerHTML = '<p class="error-msg">Error loading jobs. Please try again.</p>';
    }
}

statusFilters.addEventListener('click', (e) => {
    const target = e.target.closest('.tab-btn');
    if (target) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        fetchJobs(target.dataset.status);
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        initDashboard();
    } else {
        window.location.href = '/login.html';
    }
});