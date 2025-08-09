// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form
    initializeLoginForm();
    
    // Initialize password toggle
    initializePasswordToggle();
    
    // Check for remember me cookie
    checkRememberMe();
    
    // Check if user is already logged in
    checkLoggedInStatus();
});

// Initialize login form and event listeners
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateLoginForm()) {
                return false;
            }
            
            // Process login
            processLogin();
        });
    }
}

// Initialize password toggle functionality
function initializePasswordToggle() {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePassword.innerHTML = '<i class="fas fa-eye-slash hope-icon"></i>';
            } else {
                passwordInput.type = 'password';
                togglePassword.innerHTML = '<i class="fas fa-eye hope-icon"></i>';
            }
        });
    }
}

// Check for remember me cookie
function checkRememberMe() {
    const emailInput = document.getElementById('email');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    if (emailInput && rememberMeCheckbox) {
        // Check if email is stored in local storage
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberMeCheckbox.checked = true;
        }
    }
}

// Check if user is already logged in
function checkLoggedInStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        // Redirect to home page if already logged in
        window.location.href = 'index.html';
    }
}

// Validate login form
function validateLoginForm() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    let isValid = true;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        // Show error for email
    }
    
    // Validate password
    if (!passwordInput.value.trim()) {
        isValid = false;
        // Show error for password
    }
    
    return isValid;
}

// Process login
function processLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Handle remember me
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Store logged in user info (excluding password)
        const loggedInUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType
        };
        
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        
        // Show success message
        alert('Login successful! Welcome back, ' + user.firstName + '!');
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        // Show error message
        alert('Login unsuccessful. Invalid email or password.');
        
        // Redirect to registration page
        window.location.href = 'register.html';
    }
}

// Show error message for form field
function showError(input, message) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.invalid-feedback') || document.createElement('div');
    
    if (!formControl.querySelector('.invalid-feedback')) {
        errorElement.className = 'invalid-feedback';
        formControl.appendChild(errorElement);
    }
    
    input.classList.add('is-invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Remove error message from form field
function removeError(input) {
    input.classList.remove('is-invalid');
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.invalid-feedback');
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Process login
function processLogin() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Get form data
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const rememberMe = rememberMeCheckbox.checked;
    
    // Handle remember me functionality
    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
    
    // For demo purposes, simulate successful login
    simulateLogin(email);
}

// Simulate login (for demo purposes)
function simulateLogin(email) {
    // Show loading state
    const loginButton = document.querySelector('.btn-login');
    const originalButtonText = loginButton.innerHTML;
    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
    loginButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Store logged in user info in session storage
        sessionStorage.setItem('loggedInUser', JSON.stringify({
            email: email,
            name: email.split('@')[0], // Use part of email as name for demo
            loginTime: new Date().toISOString()
        }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    }, 1500);
}