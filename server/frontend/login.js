document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
  
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          alert('Login successful!');
          localStorage.setItem('token', data.token);
          window.location.href = 'dashboard.html'; // Next page after login
        } else {
          alert(data.message || 'Invalid email or password');
        }
      } catch (error) {
        console.error('Login failed:', error);
        alert('Something went wrong. Please try again later.');
      }
    });
  });