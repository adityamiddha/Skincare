console.log('✅ dashboard.js loaded');

(async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('📦 Token found:', token);

    if (!token) {
      console.warn('❌ No token found. Redirecting to login...');
      window.location.href = 'login.html';
      return;
    }

    const response = await fetch('http://localhost:5000/api/v1/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.warn('❌ Invalid or expired token. Redirecting...');
      window.location.href = 'login.html';
      return;
    }

    const userData = await response.json();
    console.log('👤 User Data:', userData);

    const greeting = document.querySelector('.greeting');
    if (greeting) {
      greeting.textContent = `Hello, ${userData.data.name}`;
    }
  } catch (err) {
    console.error('🔥 Uncaught error in dashboard.js:', err);
    window.location.href = 'login.html';
  }
})();

// Handle logout and upload navigation
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

function goToUpload() {
  window.location.href = 'upload.html';
}
