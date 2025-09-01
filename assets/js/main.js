// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    // Set initial theme (default is dark)
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);

    // Theme toggle functionality
    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);

        // Recreate particles with new theme
        recreateParticles();
    });
}

function updateThemeIcon(theme, iconElement) {
    if (theme === 'light') {
        iconElement.className = 'fas fa-moon';
    } else {
        iconElement.className = 'fas fa-sun';
    }
}

// Create animated particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 6) + 's';

        particlesContainer.appendChild(particle);
    }
}

function recreateParticles() {
    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';
    createParticles();
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 100;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
}

// Simple project filtering that actually works
function filterProjects(filter, projectItems) {
    console.log('Filtering by:', filter);

    let visibleIndex = 0;
    projectItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        console.log('Item', index, 'category:', category);

        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.style.display = 'flex';
            item.style.pointerEvents = 'auto';

            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, visibleIndex * 100);
            visibleIndex++;
        } else {
            item.classList.add('hidden');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            item.style.pointerEvents = 'none';

            requestAnimationFrame(() => {
                item.style.display = 'none';
            });
        }
    });
}

// Project filtering setup
document.addEventListener('DOMContentLoaded', function () {
    // Initialize theme
    initializeTheme();

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    // Initialize all projects as visible with transitions
    projectItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            filterProjects(filter, projectItems);
        });
    });

    // Initialize EmailJS and Contact Form
    initializeContactForm();
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('section-reveal')) {
                entry.target.classList.add('revealed');
            }
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.classList.add('animate');
            }
            if (entry.target.querySelector('.counter') && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-reveal, .timeline-item').forEach(el => {
    observer.observe(el);
});

// Observe stats section for counter animation
const statsSection = document.querySelector('.container .row .counter');
if (statsSection) {
    const statsContainer = statsSection.closest('.container');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    const scrollTop = document.getElementById('scrollTop');

    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        scrollTop.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        scrollTop.classList.remove('show');
    }
});

// Scroll to top functionality
document.getElementById('scrollTop').addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize particles
createParticles();

// Contact Form Initialization Function
function initializeContactForm() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded. Make sure to include EmailJS script before your custom script.');
        return;
    }

    emailjs.init("aFLwrrsESpqx_n5Wf");

    const contactForm = document.getElementById("contact-form");

    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    const sendBtn = contactForm.querySelector("button[type='submit']");
    const btnText = sendBtn ? sendBtn.querySelector(".btn-text") : null;
    const loadingIcon = sendBtn ? sendBtn.querySelector(".loading") : null;

    createNotificationContainer();

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (loadingIcon && btnText) {
            loadingIcon.classList.remove("d-none");
            btnText.classList.add("opacity-0");
        }

        if (sendBtn) {
            sendBtn.disabled = true;
        }

        emailjs.sendForm("service_6tvo6wr", "template_xexx0a9", this)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('success', 'Message sent successfully! Thank you for getting in touch.');
                contactForm.reset();
            })
            .catch(function (error) {
                console.error("EmailJS Error:", error);
                showNotification('error', 'Something went wrong. Please try again later.');
            })
            .finally(function () {
                if (loadingIcon && btnText) {
                    loadingIcon.classList.add("d-none");
                    btnText.classList.remove("opacity-0");
                }

                if (sendBtn) {
                    sendBtn.disabled = false;
                }
            });
    });
}

function createNotificationContainer() {
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 400px;
    `;
        document.body.appendChild(container);
    }
}

function showNotification(type, message) {
    const container = document.getElementById('notification-container');
    const notificationId = 'notification-' + Date.now();

    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const icon = type === 'success' ? '✓' : '⚠';

    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `alert ${alertClass} alert-dismissible fade show`;
    notification.setAttribute('role', 'alert');
    notification.style.cssText = `
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: none;
    margin-bottom: 10px;
    `;

    notification.innerHTML = `
    <div class="d-flex align-items-center">
        <span class="me-2 fs-5">${icon}</span>
        <span>${message}</span>
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        const element = document.getElementById(notificationId);
        if (element) {
            element.classList.remove('show');
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 150);
        }
    }, 5000);
}
