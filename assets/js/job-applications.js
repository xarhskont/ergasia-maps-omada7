import { auth, db } from '/assets/js/firebase-config.js';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { loadHeader, loadFooter } from '/assets/js/layout.js';

loadHeader();
loadFooter();

const appsGrid = document.getElementById('applications-grid');
const titleDisplay = document.getElementById('job-title-display');

const params = new URLSearchParams(window.location.search);
const jobId = params.get('id');

async function fetchApplications() {
    if (!jobId) {
        appsGrid.innerHTML = '<p class="empty-msg">No job ID provided.</p>';
        return;
    }

    try {
        const jobDoc = await getDoc(doc(db, 'jobs', jobId));
        if (!jobDoc.exists()) {
            appsGrid.innerHTML = '<p class="error-msg">Job not found.</p>';
            return;
        }
        
        const jobData = jobDoc.data();
        titleDisplay.innerText = jobData.title;

        // In a real app, we would query an 'applications' collection where jobId == jobId
        // For now, we'll look for users with role 'freelancer' as a mockup of candidates
        const q = query(collection(db, 'users'), where('role', '==', 'freelancer'));
        const querySnapshot = await getDocs(q);

        appsGrid.innerHTML = '';
        if (querySnapshot.empty) {
            appsGrid.innerHTML = '<p class="empty-msg">No one has applied to this job yet.</p>';
            return;
        }

        querySnapshot.forEach((userDoc) => {
            const user = userDoc.data();
            const uid = userDoc.id;
            
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <h3>${user.fullName}</h3>
                <p class="job-excerpt">${user.bio || 'No bio provided.'}</p>
                <div class="job-meta">
                    <span class="budget">Rating: ${user.averageRating || 'N/A'}</span>
                    <span class="deadline">Skills: ${user.skills ? user.skills.join(', ') : 'None'}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <a href="freelancer-profile.html?id=${uid}" target="_blank" class="btn-view" style="flex: 1; text-decoration: none; text-align: center;">View Profile</a>
                    <button class="btn-submit" id="hire-${uid}" style="flex: 1; border: none; cursor: pointer;">Hire</button>
                </div>
            `;
            appsGrid.appendChild(card);

            document.getElementById(`hire-${uid}`).addEventListener('click', async () => {
                if (confirm(`Are you sure you want to hire ${user.fullName}?`)) {
                    await updateDoc(doc(db, 'jobs', jobId), {
                        status: 'assigned',
                        assignedFreelancerId: uid,
                        assignedFreelancerName: user.fullName
                    });
                    alert('Freelancer hired successfully!');
                    window.location.href = 'employer-dashboard.html';
                }
            });
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        appsGrid.innerHTML = '<p class="error-msg">Error loading applications.</p>';
    }
}

fetchApplications();
