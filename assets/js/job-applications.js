import { db } from '/assets/js/firebase-config.js';
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
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

        // REAL LOGIC: Query the 'applications' collection for this specific jobId
        const q = query(collection(db, 'applications'), where('jobId', '==', jobId));
        const querySnapshot = await getDocs(q);

        appsGrid.innerHTML = '';
        if (querySnapshot.empty) {
            appsGrid.innerHTML = '<p class="empty-msg">No one has applied to this job yet.</p>';
            return;
        }

        // For each application, we need to fetch the freelancer's user details
        for (const appDoc of querySnapshot.docs) {
            const appData = appDoc.data();

            // Skip rendering if the application is already rejected
            if (appData.status === 'rejected') {
                continue;
            }

            const freelancerId = appData.freelancerId;

            // Fetch freelancer profile
            const userDoc = await getDoc(doc(db, 'users', freelancerId));
            const user = userDoc.exists()
                ? userDoc.data()
                : { fullName: 'Unknown Freelancer', bio: 'No profile available' };

            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                    <h3>${user.fullName}</h3>
                    <p class="job-excerpt">${user.bio || 'No bio provided.'}</p>
                    <div class="job-meta">
                        <span class="budget">Proposal: $${appData.bid || 'N/A'}</span>
                        <span class="deadline">Est. Time: ${appData.estimatedTime || 'N/A'} days</span>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <a href="freelancer-profile.html?id=${freelancerId}" target="_blank" class="btn-view" style="flex: 1; display: flex; justify-content: center; align-items: center; box-sizing: border-box; text-decoration: none; padding: 12px; background: #e2e8f0; color: #475569; border-radius: 8px; font-weight: 600; font-size: 1rem;">View Profile</a>
                        <button class="btn-submit" id="hire-${freelancerId}" style="flex: 1; display: flex; justify-content: center; align-items: center; box-sizing: border-box; border: none; cursor: pointer; padding: 12px; background: #8b5cf6; color: white; border-radius: 8px; font-weight: 600; font-size: 1rem;">Hire</button>
                        <button class="btn-submit" id="reject-${freelancerId}" style="flex: 1; display: flex; justify-content: center; align-items: center; box-sizing: border-box; border: none; cursor: pointer; padding: 12px; background: #ef4444; color: white; border-radius: 8px; font-weight: 600; font-size: 1rem;">Reject</button>
                    </div>
                `;
            appsGrid.appendChild(card);

            document.getElementById(`hire-${freelancerId}`).addEventListener('click', async () => {
                if (confirm(`Are you sure you want to hire ${user.fullName}?`)) {
                    try {
                        // 1. Update the Job document
                        await updateDoc(doc(db, 'jobs', jobId), {
                            status: 'assigned',
                            assignedFreelancerId: freelancerId,
                            assignedFreelancerName: user.fullName
                        });

                        // 2. Update the specific Application document to 'accepted'
                        const appQ = query(
                            collection(db, 'applications'),
                            where('jobId', '==', jobId),
                            where('freelancerId', '==', freelancerId)
                        );
                        const appSnapshot = await getDocs(appQ);

                        if (!appSnapshot.empty) {
                            const appDocId = appSnapshot.docs[0].id;
                            await updateDoc(doc(db, 'applications', appDocId), {
                                status: 'assigned'
                            });
                        }

                        alert('Freelancer hired successfully!');
                        window.location.href = 'employer-dashboard.html';
                    } catch (error) {
                        console.error('Hire Error:', error);
                        alert('Error during hiring process: ' + error.message);
                    }
                }
            });

            // Reject logic added here
            document
                .getElementById(`reject-${freelancerId}`)
                .addEventListener('click', async () => {
                    if (
                        confirm(`Are you sure you want to reject ${user.fullName}'s application?`)
                    ) {
                        try {
                            // Update the specific Application document to 'rejected'
                            const appQ = query(
                                collection(db, 'applications'),
                                where('jobId', '==', jobId),
                                where('freelancerId', '==', freelancerId)
                            );
                            const appSnapshot = await getDocs(appQ);

                            if (!appSnapshot.empty) {
                                const appDocId = appSnapshot.docs[0].id;
                                await updateDoc(doc(db, 'applications', appDocId), {
                                    status: 'rejected'
                                });
                            }

                            alert('Application rejected.');
                            // Reload the page to reflect the new state (or to trigger UI updates based on your dashboard logic)
                            window.location.reload();
                        } catch (error) {
                            console.error('Reject Error:', error);
                            alert('Error during rejection process: ' + error.message);
                        }
                    }
                });
        }
    } catch (error) {
        console.error('Error fetching applications:', error);
        appsGrid.innerHTML = '<p class="error-msg">Error loading applications.</p>';
    }
}

fetchApplications();
