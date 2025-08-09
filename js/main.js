// Main JavaScript file for common functionality across all pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled', 'shadow-sm');
            } else {
                navbar.classList.remove('navbar-scrolled', 'shadow-sm');
            }
        });
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Update navigation based on login status
    updateNavigation();

    // Display recent donors on home page
    displayRecentDonors();
});

// Function to update navigation based on login status
function updateNavigation() {
    const navbarNav = document.getElementById('navbarNav');
    if (!navbarNav) return;
    
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    // Get the login and register nav items
    const loginNavItem = navbarNav.querySelector('a[href="login.html"]')?.parentElement;
    const registerNavItem = navbarNav.querySelector('a[href="register.html"]')?.parentElement;
    
    if (loggedInUser) {
        // User is logged in
        if (loginNavItem) {
            // Replace login with user's name
            loginNavItem.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user me-1"></i>${loggedInUser.firstName}
                </a>
                <ul class="dropdown-menu" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#">My Profile</a></li>
                    <li><a class="dropdown-item" href="#">My Donations</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                </ul>
            `;
            loginNavItem.classList.add('dropdown');
            
            // Add logout functionality
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Clear logged in user
                    localStorage.removeItem('loggedInUser');
                    // Reload page
                    window.location.reload();
                });
            }
        }
        
        // Hide register link
        if (registerNavItem) {
            registerNavItem.classList.add('d-none');
        }
    } else {
        // User is not logged in
        if (loginNavItem) {
            loginNavItem.innerHTML = '<a class="nav-link" href="login.html">Login</a>';
            loginNavItem.classList.remove('dropdown');
        }
        
        // Show register link
        if (registerNavItem) {
            registerNavItem.classList.remove('d-none');
        }
    }
}

// Function to display recent donors on the home page
function displayRecentDonors() {
    const donorsSection = document.getElementById('recent-donors');
    if (!donorsSection) return;

    // Get donors from local storage
    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    
    // Sort by date (newest first)
    donors.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take only the most recent donors (up to 6)
    donors = donors.slice(0, 6);
    
    if (donors.length === 0) {
        // Display sample donors if no real donors exist
        const sampleDonors = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                amount: 100,
                cause: 'Education',
                date: new Date().toISOString(),
                message: 'Happy to support this great cause!'
            }
        ];
        
        // Display sample donors
        displayDonors(sampleDonors);
    } else {
        // Display real donors
        displayDonors(donors);
    }
}

// Function to render donor cards
function renderDonorCards(donors) {
    const donorsContainer = document.getElementById('donors-container');
    if (!donorsContainer) return;
    
    // Clear existing content
    donorsContainer.innerHTML = '';
    
    // Add a row div with text-end class to align content to the right
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row justify-content-end';
    donorsContainer.appendChild(rowDiv);
    
    donors.forEach((donor, index) => {
        const donorCard = document.createElement('div');
        donorCard.className = 'col-md-6 col-lg-4';
        donorCard.setAttribute('data-aos', 'fade-up');
        donorCard.setAttribute('data-aos-delay', (index * 100).toString());
        
        // Format date
        const donationDate = new Date(donor.date);
        const formattedDate = donationDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Generate random avatar
        const gender = Math.random() > 0.5 ? 'men' : 'women';
        const avatarId = Math.floor(Math.random() * 100);
        const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;
        
        donorCard.innerHTML = `
            <div class="donor-card h-100">
                <div class="donor-card-header">
                    <h5 class="mb-0">Donation for ${donor.cause}</h5>
                </div>
                <div class="card-body">
                    <div class="donor-info">
                        <div class="donor-avatar">
                            <img src="${avatarUrl}" alt="Donor Avatar">
                        </div>
                        <div class="donor-details">
                            <h5>${donor.name}</h5>
                            <p>${donor.email || 'Anonymous'}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="d-flex justify-content-between">
                            <span class="donation-amount">$${donor.amount}</span>
                            <span class="donation-date">${formattedDate}</span>
                        </div>
                        ${donor.message ? `<p class="donation-message">"${donor.message}"</p>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        rowDiv.appendChild(donorCard);
    });
}