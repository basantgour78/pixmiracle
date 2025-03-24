// PixMiracle Custom JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Navbar Scroll Effect with Animation
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.add('shadow-sm');
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.remove('shadow-sm');
            navbar.style.padding = '1rem 0';
        }
    });
    
    // Show announcement banner with animation
    const announcementBanner = document.querySelector('.announcement-banner');
    const closeBannerBtn = document.querySelector('.close-banner');
    
    if (announcementBanner && closeBannerBtn) {
        // Check if the banner was previously closed in this session
        const isBannerClosed = sessionStorage.getItem('bannerClosed');
        
        if (isBannerClosed !== 'true') {
            // Remove the inline display:none
            announcementBanner.style.display = '';
            
            // Add slight delay before animation
            setTimeout(() => {
                announcementBanner.classList.add('show');
                document.body.classList.add('has-announcement');
                
                // Adjust navbar position
                navbar.style.top = announcementBanner.offsetHeight + 'px';
            }, 300);
            
            // Handle close button
            closeBannerBtn.addEventListener('click', function() {
                announcementBanner.classList.remove('show');
                
                // Set a timeout to match the animation duration
                setTimeout(() => {
                    announcementBanner.style.display = 'none';
                    document.body.classList.remove('has-announcement');
                    navbar.style.top = '0';
                    
                    // Store in session storage so it stays closed during this session
                    sessionStorage.setItem('bannerClosed', 'true');
                }, 400);
            });
        }
    }
    
    // Add mega menu hover effects
    const dropdownItems = document.querySelectorAll('.dropdown');
    
    dropdownItems.forEach(item => {
        const menu = item.querySelector('.dropdown-menu');
        
        if (menu) {
            // For desktop: use hover effects
            if (window.innerWidth >= 992) {
                item.addEventListener('mouseenter', function() {
                    menu.style.display = 'block';
                    setTimeout(() => {
                        menu.style.opacity = '1';
                        menu.style.visibility = 'visible';
                        menu.style.transform = 'translateY(0)';
                    }, 10);
                });
                
                item.addEventListener('mouseleave', function() {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(10px)';
                });
            }
        }
    });
    
    // Improved smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate the offset (accounting for fixed header)
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Smooth scroll to the target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
                
                // For mobile: Close the navbar collapse when a link is clicked
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // Add advanced scroll-spy for active navigation highlighting
    function updateActiveNavLinks() {
        const scrollPosition = window.scrollY;
        
        // Get all sections that have an ID defined
        const sections = document.querySelectorAll('section[id], header[id]');
        
        // Check which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Adjust offset as needed
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                document.querySelectorAll('.navbar .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding nav link
                const correspondingNavLink = document.querySelector(`.navbar .nav-link[href="#${sectionId}"]`);
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                    
                    // If inside a dropdown, activate parent too
                    const parentDropdown = correspondingNavLink.closest('.dropdown');
                    if (parentDropdown) {
                        const parentNavLink = parentDropdown.querySelector('.nav-link');
                        if (parentNavLink) {
                            parentNavLink.classList.add('active');
                        }
                    }
                }
            }
        });
        
        // Special case for top of page when no sections are in viewport yet
        if (scrollPosition < 150) {
            document.querySelectorAll('.navbar .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Set home link as active if it exists
            const homeLink = document.querySelector('.navbar .nav-link[href="index.html"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }
    
    // Run the function on load and scroll
    window.addEventListener('scroll', updateActiveNavLinks);
    window.addEventListener('load', updateActiveNavLinks);
    
    // Hero Carousel Enhancement
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        // Get all carousel items
        const carouselItems = heroCarousel.querySelectorAll('.carousel-item');
        
        // Initialize Bootstrap carousel
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            wrap: true,
            pause: 'hover'
        });
        
        // Add event listeners for slide events
        heroCarousel.addEventListener('slide.bs.carousel', function(event) {
            // Get the next slide
            const nextSlide = event.relatedTarget;
            
            // Reset animation for other slides
            carouselItems.forEach(item => {
                if (item !== nextSlide) {
                    const content = item.querySelector('.carousel-item-content');
                    if (content) {
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(20px)';
                    }
                }
            });
        });
        
        // Animate the content when the slide is shown
        heroCarousel.addEventListener('slid.bs.carousel', function(event) {
            // Get the current active slide
            const activeSlide = event.relatedTarget;
            
            // Animate the content
            const content = activeSlide.querySelector('.carousel-item-content');
            if (content) {
                setTimeout(() => {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }
    
    // Add animation class to elements when they come into view
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    
    // Set up intersection observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                const speed = 30; // Lower is faster
                
                // Only start counter if not already started
                if (parseInt(counter.innerText) === 0) {
                    const updateCount = () => {
                        // Calculate increment based on target value
                        const increment = target > 100 ? Math.ceil(target / 100) : 1;
                        count += increment;
                        
                        // Update the counter text
                        counter.innerText = count;
                        
                        // Check if target is reached
                        if (count < target) {
                            // Continue counting
                            setTimeout(updateCount, speed);
                        } else {
                            // Ensure the final displayed value is exactly the target
                            counter.innerText = target;
                        }
                    };
                    
                    // Start counter animation
                    updateCount();
                }
                
                // Stop observing after animation has started
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Start observing all counters
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Form Validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Check for URL parameters to display success/error messages
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const formContainer = contactForm.parentElement;
        
        if (status === 'success') {
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.setAttribute('style', 'scroll-margin-top: 100px;');
            successMessage.className = 'alert alert-success mt-4';
            successMessage.innerHTML = `
                <h4 class="alert-heading">Message Sent!</h4>
                <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
            `;
            
            // Show success message
            contactForm.reset();
            formContainer.appendChild(successMessage);
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Optional: Restore form after some time
            setTimeout(() => {
                successMessage.remove();
                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 6000);
        } else if (status === 'error') {
            // Create error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger mt-4';
            errorMessage.innerHTML = `
                <h4 class="alert-heading">Oops! Something went wrong.</h4>
                <p>We couldn't process your message. Please try again or contact us directly by phone.</p>
            `;
            
            // Show error message
            formContainer.insertBefore(errorMessage, contactForm);
            
            // Scroll to error message
            errorMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Optional: Remove error message after some time
            setTimeout(() => {
                errorMessage.remove();
                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 6000);
        }

        // Client-side validation before submission
        contactForm.addEventListener('submit', function(event) {
            // Only do client-side validation, don't prevent default as we want the form to submit to our PHP handler
            
            // Basic form validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    isValid = false;
                    emailField.classList.add('is-invalid');
                }
            }
            
            if (!isValid) {
                event.preventDefault(); // Only prevent submission if validation fails
            }
        });
        
        // Real-time validation as user types
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.hasAttribute('required') && this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
                
                // Special case for email
                if (this.id === 'email' && this.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailPattern.test(this.value.trim())) {
                        this.classList.remove('is-invalid');
                    }
                }
            });
        });
    }
    
    // Service Navigation Smooth Scroll on Services Page
    const serviceLinks = document.querySelectorAll('a[href^="#"]');
    
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only if the link points to an ID on the page
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Scroll to the element with an offset for the fixed navbar
                    const offset = 100; // Adjust based on navbar height
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without refresh
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // Image gallery lightbox functionality (for potential portfolio section)
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            const imageUrl = this.getAttribute('src');
            const altText = this.getAttribute('alt');
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox-overlay';
            lightbox.innerHTML = `
                <div class="lightbox-container">
                    <img src="${imageUrl}" alt="${altText}" class="lightbox-image">
                    <span class="lightbox-close">&times;</span>
                    <p class="lightbox-caption">${altText}</p>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close lightbox when clicking outside the image or on close button
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.className === 'lightbox-close') {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = 'auto';
                }
            });
        });
    });
    
    // Initialize any Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Add active class to current section in navbar
    function setActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200; // Adjust for navbar offset
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.navbar .nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === '#' + sectionId) {
                        navLink.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavItem);
    
    // Add back-to-top button functionality
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Service Navigation Interactive Features
    const serviceNavItems = document.querySelectorAll('.service-nav-item');
    if (serviceNavItems.length > 0) {
        // Function to highlight the active service based on scroll position
        function highlightActiveService() {
            const scrollPosition = window.scrollY;
            
            // Get all service sections
            const serviceSections = document.querySelectorAll('section[id]');
            
            // Check which section is currently in view
            serviceSections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all nav items
                    serviceNavItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Add active class to the corresponding nav item
                    const activeNavItem = document.querySelector(`.service-nav-item[href="#${sectionId}"]`);
                    if (activeNavItem) {
                        activeNavItem.classList.add('active');
                    }
                }
            });
        }
        
        // Add smooth scrolling to service navigation
        serviceNavItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Listen for scroll events to highlight active service
        window.addEventListener('scroll', highlightActiveService);
        
        // Initial highlight
        highlightActiveService();
    }
    
    // Training Navigation Interactive Features
    const trainingNavItems = document.querySelectorAll('.training-nav-item');
    if (trainingNavItems.length > 0) {
        // Function to highlight the active training based on scroll position
        function highlightActiveTraining() {
            const scrollPosition = window.scrollY;
            
            // Get all training sections
            const trainingSections = document.querySelectorAll('section[id]');
            
            // Check which section is currently in view
            trainingSections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all nav items
                    trainingNavItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Add active class to the corresponding nav item
                    const activeNavItem = document.querySelector(`.training-nav-item[href="#${sectionId}"]`);
                    if (activeNavItem) {
                        activeNavItem.classList.add('active');
                    }
                }
            });
        }
        
        // Add smooth scrolling to training navigation
        trainingNavItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Listen for scroll events to highlight active training
        window.addEventListener('scroll', highlightActiveTraining);
        
        // Initial highlight
        highlightActiveTraining();
    }
});

// Add CSS for lightbox
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .lightbox-container {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            display: block;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            margin-top: 10px;
        }
    </style>
`);

// Add 'animate-on-scroll' class to elements that should animate on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Elements that should have fade-in animation
    const elementsToAnimate = [
        '.hero-section h1',
        '.hero-section p',
        '.hero-section .btn',
        'section h2',
        'section .lead',
        '.card',
        '.col-lg-6',
        '.testimonial',
        '.accordion-item'
    ];
    
    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            // Add a slight delay to each subsequent element
            element.style.animationDelay = (index * 0.1) + 's';
        });
    });
}); 