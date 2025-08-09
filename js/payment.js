// Payment Page JavaScript with Stripe Integration

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    initializePaymentForm();
});

// Initialize payment form elements and event listeners
function initializePaymentForm() {
    // Get form elements
    const donationForm = document.getElementById('donation-form');
    const amountOptions = document.querySelectorAll('input[name="donationAmount"]');
    const customAmountInput = document.getElementById('customAmount');
    const customAmountContainer = document.getElementById('customAmountContainer');
    const causeSelect = document.getElementById('cause');
    const frequencyOptions = document.querySelectorAll('input[name="donationFrequency"]');
    
    // Handle donation amount selection
    amountOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'custom') {
                customAmountContainer.classList.remove('d-none');
                customAmountInput.focus();
            } else {
                customAmountContainer.classList.add('d-none');
            }
        });
    });
    
    // Handle form submission
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return false;
            }
            
            // Get form data
            const formData = getFormData();
            
            // Initialize Stripe payment
            initializeStripe(formData);
        });
    }
}

// Validate the donation form
function validateForm() {
    // Get form elements
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const amountOptions = document.querySelectorAll('input[name="donationAmount"]');
    const customAmountInput = document.getElementById('customAmount');
    
    let isValid = true;
    
    // Validate name
    if (!firstName.value.trim()) {
        showError(firstName, 'First name is required');
        isValid = false;
    } else {
        removeError(firstName);
    }
    
    if (!lastName.value.trim()) {
        showError(lastName, 'Last name is required');
        isValid = false;
    } else {
        removeError(lastName);
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        showError(email, 'Valid email is required');
        isValid = false;
    } else {
        removeError(email);
    }
    
    // Validate phone
    const phoneRegex = /^\d{10}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
        showError(phone, 'Valid 10-digit phone number is required');
        isValid = false;
    } else {
        removeError(phone);
    }
    
    // Validate donation amount
    let selectedAmount = false;
    let amount = 0;
    
    amountOptions.forEach(option => {
        if (option.checked) {
            selectedAmount = true;
            if (option.value === 'custom') {
                amount = parseFloat(customAmountInput.value);
                if (isNaN(amount) || amount <= 0) {
                    showError(customAmountInput, 'Please enter a valid amount');
                    isValid = false;
                } else {
                    removeError(customAmountInput);
                }
            } else {
                amount = parseFloat(option.value);
            }
        }
    });
    
    if (!selectedAmount) {
        // Show error for amount selection
        document.getElementById('amountError').textContent = 'Please select a donation amount';
        document.getElementById('amountError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('amountError').style.display = 'none';
    }
    
    return isValid;
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

// Get form data
function getFormData() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const cause = document.getElementById('cause').value;
    const message = document.getElementById('message').value.trim();
    
    // Get selected amount
    let amount = 0;
    const amountOptions = document.querySelectorAll('input[name="donationAmount"]');
    amountOptions.forEach(option => {
        if (option.checked) {
            if (option.value === 'custom') {
                amount = parseFloat(document.getElementById('customAmount').value);
            } else {
                amount = parseFloat(option.value);
            }
        }
    });
    
    // Get selected frequency
    let frequency = 'one-time';
    const frequencyOptions = document.querySelectorAll('input[name="donationFrequency"]');
    frequencyOptions.forEach(option => {
        if (option.checked) {
            frequency = option.value;
        }
    });
    
    return {
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        amount: amount,
        cause: cause,
        frequency: frequency,
        message: message,
        date: new Date().toISOString()
    };
}

// Initialize Stripe payment
function initializeStripe(formData) {
    // Initialize Stripe with your publishable key
    const stripe = window.stripe('pk_test_51Ru7m0H8MsiexWQGpyBRXjZvSyc37AHbJtQzqY7MWrM5IMGIVR0FlPP7K6vyZ2MLqCB9Kk0I4kDtWZTB6Ic9pXEW00MBmtJ12t');
    
    // In a real implementation, you would:
    // 1. Make an AJAX call to your server to create a payment intent
    // 2. Use the returned client secret to confirm the payment
    // 3. Handle the payment result
    
    // For demo purposes, we'll simulate a successful payment
    try {
        // This would be where you'd implement the actual Stripe payment flow
        // Example of a real implementation (commented out):
        fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: formData.amount * 100, // Amount in cents
                currency: 'usd',
                description: `Donation for ${formData.cause}`,
                customer_email: formData.email
            })
        })
        .then(response => response.json())
        .then(data => {
            return stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement('card'),
                    billing_details: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone
                    }
                }
            });
        })
        .then(result => {
            if (result.error) {
                console.error(result.error.message);
            } else {
                handlePaymentSuccess(result, formData);
            }
        });
      
        
        // For demo purposes, simulate successful payment
        simulatePaymentSuccess(formData);
    } catch (error) {
        console.error('Stripe initialization error:', error);
        // For demo purposes, simulate successful payment
        simulatePaymentSuccess(formData);
    }
}

// Handle successful payment
function handlePaymentSuccess(response, formData) {
    // Save donor data to local storage
    saveDonorData(formData);
    
    // Show success message
    showPaymentSuccess(formData);
    
    // Redirect to home page after a delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// Simulate payment success (for demo purposes)
function simulatePaymentSuccess(formData) {
    console.log('Simulating payment success for demo purposes');
    
    // Save donor data to local storage
    saveDonorData(formData);
    
    // Show success message
    showPaymentSuccess(formData);
    
    // Redirect to home page after a delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 8000);
}

// Save donor data to local storage
function saveDonorData(formData) {
    // Get existing donors or initialize empty array
    const existingDonors = JSON.parse(localStorage.getItem('donors')) || [];
    
    // Add new donor
    existingDonors.push(formData);
    
    // Save to local storage
    localStorage.setItem('donors', JSON.stringify(existingDonors));
}

// Show payment success message
function showPaymentSuccess(formData) {
    // Create success popup if it doesn't exist
    if (!document.getElementById('successPopup')) {
        const popupHTML = `
        <div class="modal fade" id="successPopup" tabindex="-1" aria-labelledby="successPopupLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title" id="successPopupLabel"><i class="fas fa-check-circle me-2"></i>Payment Successful!</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center py-4">
                        <div class="mb-4">
                            <i class="fas fa-heart text-danger" style="font-size: 4rem;"></i>
                        </div>
                        <h4>Thank You for Your Donation!</h4>
                        <p class="lead mb-1">Amount: ₹<span id="donationAmount"></span></p>
                        <p class="mb-3">Cause: <span id="donationCause"></span></p>
                        <p class="text-muted">Your contribution will make a difference.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark w-50" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`;
        
        // Append popup to body
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }
    
    // Set donation details in popup
    document.getElementById('donationAmount').textContent = formData.amount;
    document.getElementById('donationCause').textContent = formData.cause;
    
    // Show the popup
    const successPopup = new bootstrap.Modal(document.getElementById('successPopup'));
    successPopup.show();
}