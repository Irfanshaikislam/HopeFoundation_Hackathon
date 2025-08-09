// Aim Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress bars with animation
    initializeProgressBars();
    
    // Initialize counters
    initializeCounters();
});

// Initialize progress bars with animation
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length > 0) {
        // Add intersection observer to animate progress bars when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.getAttribute('aria-valuenow') + '%';
                    
                    // Animate the progress bar
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, 200);
                    
                    // Stop observing once animated
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe each progress bar
        progressBars.forEach(progressBar => {
            // Set initial width to 0
            progressBar.style.width = '0%';
            // Start observing
            observer.observe(progressBar);
        });
    }
}

// Initialize counters with animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        // Add intersection observer to animate counters when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const step = Math.ceil(target / (duration / 16)); // 60fps
                    
                    // Animate the counter
                    let current = 0;
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target.toLocaleString();
                            clearInterval(timer);
                        } else {
                            counter.textContent = current.toLocaleString();
                        }
                    }, 16);
                    
                    // Stop observing once animated
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe each counter
        counters.forEach(counter => {
            // Set initial value to 0
            counter.textContent = '0';
            // Start observing
            observer.observe(counter);
        });
    }
}