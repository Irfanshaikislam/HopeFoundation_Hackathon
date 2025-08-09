// Register Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize register form
    initializeRegisterForm();
    
    // Initialize password toggle
    initializePasswordToggle();
    
    // Initialize user type selection
    initializeUserTypeSelection();
});

// Initialize register form and event listeners
function initializeRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateRegisterForm()) {
                return false;
            }
            
            // Process registration
            processRegistration();
        });
    }
    
    // Initialize password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    // Initialize password confirmation checker
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            checkPasswordMatch();
        });
    }
}

// Initialize password toggle functionality
function initializePasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePassword.innerHTML = '<i class="fas fa-eye-slash user-icon"></i>';
            } else {
                passwordInput.type = 'password';
                togglePassword.innerHTML = '<i class="fas fa-eye user-icon"></i>';
            }
        });
    }
}

// Initialize user type selection
function initializeUserTypeSelection() {
    const userTypeOptions = document.querySelectorAll('input[name="userType"]');
    const volunteerFields = document.querySelector('.volunteer-fields');
    
    userTypeOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'volunteer' && volunteerFields) {
                volunteerFields.classList.remove('d-none');
            } else if (volunteerFields) {
                volunteerFields.classList.add('d-none');
            }
        });
    });
}

// Validate register form
function validateRegisterForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsCheck = document.getElementById('termsCheck').checked;
    
    let isValid = true;
    
    // Validate first name
    if (!firstName) {
        isValid = false;
        // Show error for first name
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        isValid = false;
        // Show error for email
    }
    
    // Validate password
    if (!password || password.length < 6) {
        isValid = false;
        // Show error for password
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        isValid = false;
        // Show error for password confirmation
    }
    
    // Validate terms acceptance
    if (!termsCheck) {
        isValid = false;
        // Show error for terms
    }
    
    return isValid;
}

// Process registration
function processRegistration() {
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const newsletter = document.getElementById('newsletterCheck').checked;
    
    // Create user object
    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password,
        userType: userType,
        newsletter: newsletter,
        registrationDate: new Date().toISOString()
    };
    
    // Store user data in localStorage
    saveUserToLocalStorage(user);
    
    // Show success message
    alert('Registration successful! You can now log in.');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Save user to localStorage
function saveUserToLocalStorage(user) {
    // Get existing users or initialize empty array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Add new user
    users.push(user);
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
}

// Check password strength
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthMeter = document.querySelector('.progress-bar');
    const strengthText = document.getElementById('strengthText');
    const passwordStrength = document.getElementById('passwordStrength');
    
    if (passwordStrength) {
        passwordStrength.classList.remove('d-none');
    }
    
    // Define strength criteria
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    // Calculate strength score (0-100)
    let strengthScore = 0;
    if (hasLowerCase) strengthScore += 20;
    if (hasUpperCase) strengthScore += 20;
    if (hasNumber) strengthScore += 20;
    if (hasSpecialChar) strengthScore += 20;
    if (isLongEnough) strengthScore += 20;
    
    // Update strength meter
    if (strengthMeter) {
        strengthMeter.style.width = strengthScore + '%';
        
        // Update color based on strength
        if (strengthScore < 40) {
            strengthMeter.className = 'progress-bar bg-danger';
            if (strengthText) strengthText.textContent = 'Weak';
        } else if (strengthScore < 80) {
            strengthMeter.className = 'progress-bar bg-warning';
            if (strengthText) strengthText.textContent = 'Medium';
        } else {
            strengthMeter.className = 'progress-bar bg-success';
            if (strengthText) strengthText.textContent = 'Strong';
        }
    }
}

// Check if passwords match
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        // Show mismatch error
    } else {
        // Clear mismatch error
    }
}