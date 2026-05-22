import { auth, db } from '/assets/js/firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { loadHeader, loadFooter } from '/assets/js/layout.js';

loadHeader();
loadFooter();

const jobForm = document.getElementById('create-job-form');

jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to post a job!');
        window.location.href = '../login.html';
        return;
    }

    const jobData = {
        title: document.getElementById('jobTitle').value,
        category: document.getElementById('category').value,
        description: document.getElementById('jobDescription').value,
        budget: parseFloat(document.getElementById('budget').value),
        deadline: document.getElementById('deadline').value,
        employerId: user.uid,
        employerName: user.displayName || 'Employer',
        status: 'open',
        createdAt: serverTimestamp(),
        applications: []
    };

    const submitBtn = jobForm.querySelector('button');
    try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Posting...';

        await addDoc(collection(db, 'jobs'), jobData);
        
        alert('Job posted successfully!');
        window.location.href = 'employer-dashboard.html';
    } catch (error) {
        console.error('Error posting job:', error);
        alert(`Failed to post job: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Post Job';
    }
});