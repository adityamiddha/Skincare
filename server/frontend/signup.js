document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // prevent default form submission
  
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Signup successful!');
        window.location.href = 'login.html';
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      alert('Something went wrong: ' + err.message);
    }
  });