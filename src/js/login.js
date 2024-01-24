document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const voterId = document.getElementById('voterId').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`http://127.0.0.1:8000/login?voter_id=${voterId}&password=${password}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${voterId}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            const role = data.role;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            
            // Redirect based on role
            if (role === 'admin') {
                window.location.href = '/admin.html?Authorization=Bearer ' + token;
            } else {
                window.location.href = '/index.html?Authorization=Bearer ' + token;
            }
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
});
