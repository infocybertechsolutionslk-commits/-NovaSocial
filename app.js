// NovaSocial Main Interactivity Script

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Navigation & Header Scroll State
    // ----------------------------------------------------
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightNavOnScroll();
    });

    // Mobile nav toggle
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        // Toggle mobile bar shapes to 'X'
        const bars = mobileToggle.querySelectorAll('.bar');
        if (navLinks.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu on click of mobile nav item
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            const bars = mobileToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Navigation highlight based on scroll position
    const sections = document.querySelectorAll('section');
    function highlightNavOnScroll() {
        let scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                const id = section.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // ----------------------------------------------------
    // 2. Interactive Canvas Particle Background
    // ----------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse coordinates
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle constructor
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        // Draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        // Update position and boundary check
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Draw particle
            this.draw();
        }
    }

    // Initialize particle array
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
        if (numberOfParticles > 100) numberOfParticles = 100;
        if (numberOfParticles < 30) numberOfParticles = 30;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            // Generate neon blue and green colors
            let color = Math.random() > 0.5 ? 'rgba(0, 180, 216, 0.4)' : 'rgba(0, 245, 212, 0.4)';
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles with lines
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                    opacityValue = 1 - (distance / ((canvas.width / 8) * (canvas.height / 8)));
                    ctx.strokeStyle = `rgba(0, 180, 216, ${opacityValue * 0.12})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }

            // Connect particles to mouse
            if (mouse.x != null && mouse.y != null) {
                let distanceMouse = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x))
                                  + ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
                if (distanceMouse < mouse.radius * mouse.radius) {
                    opacityValue = 1 - (distanceMouse / (mouse.radius * mouse.radius));
                    ctx.strokeStyle = `rgba(0, 245, 212, ${opacityValue * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    // Run Particle Background
    resizeCanvas();
    animate();

    // ----------------------------------------------------
    // 3. Scroll Reveal & Stats Counting Logic
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const statCards = document.querySelectorAll('.stat-card');
    let statsAnimated = false;

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
                
                // If this is the about stats section, animate counts
                if (entry.target.classList.contains('stat-card') && !statsAnimated) {
                    animateStats();
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    function animateStats() {
        statsAnimated = true;
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const countTo = target;
            let current = 0;
            const duration = 2000; // 2 seconds
            const stepTime = 30; // Milliseconds per step
            const totalSteps = duration / stepTime;
            const stepIncrement = countTo / totalSteps;
            
            const timer = setInterval(() => {
                current += stepIncrement;
                if (current >= countTo) {
                    current = countTo;
                    clearInterval(timer);
                }
                
                // Formatting rules depending on standard indicators
                if (stat.parentNode.id === 'stat-years') {
                    stat.textContent = Math.floor(current) + '+';
                } else if (stat.parentNode.id === 'stat-campaigns') {
                    stat.textContent = Math.floor(current) + '+';
                } else if (stat.parentNode.id === 'stat-views') {
                    stat.textContent = Math.floor(current) + 'M+';
                } else if (stat.parentNode.id === 'stat-roi') {
                    stat.textContent = Math.floor(current) + '%';
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    // ----------------------------------------------------
    // 4. Social Growth Estimator (ROI Calculator)
    // ----------------------------------------------------
    const budgetSlider = document.getElementById('budget-slider');
    const budgetValueDisplay = document.getElementById('budget-value');
    const platformSelect = document.getElementById('platform-select');
    
    const estReachDisplay = document.getElementById('est-reach');
    const estClicksDisplay = document.getElementById('est-clicks');
    const roiGaugeFill = document.getElementById('roi-gauge-fill');
    const gaugeRoiVal = document.getElementById('gauge-roi-val');

    function updateEstimator() {
        const budget = parseInt(budgetSlider.value);
        
        // Show current slider values
        budgetValueDisplay.textContent = `$${budget.toLocaleString()}`;
        
        // Update slider fills dynamically using CSS variable
        const percent = ((budget - budgetSlider.min) / (budgetSlider.max - budgetSlider.min)) * 100;
        budgetSlider.style.setProperty('--percent', `${percent}%`);

        const platform = platformSelect.value;
        
        let reachMin, reachMax, clickMin, clickMax, roiMin, roiMax;

        switch (platform) {
            case 'tiktok':
                // High view reach, lower conversions
                reachMin = budget * 90;
                reachMax = budget * 130;
                clickMin = Math.round(reachMin * 0.015);
                clickMax = Math.round(reachMax * 0.025);
                roiMin = 3.5;
                roiMax = 5.2;
                break;
            case 'facebook':
                // Moderate reach, higher lead capture/clicks
                reachMin = budget * 65;
                reachMax = budget * 95;
                clickMin = Math.round(reachMin * 0.035);
                clickMax = Math.round(reachMax * 0.055);
                roiMin = 3.0;
                roiMax = 4.6;
                break;
            case 'omni':
                // Premium omni-channel blend
                reachMin = budget * 80;
                reachMax = budget * 110;
                clickMin = Math.round(reachMin * 0.025);
                clickMax = Math.round(reachMax * 0.045);
                roiMin = 4.0;
                roiMax = 5.8;
                break;
        }

        // Format outputs
        estReachDisplay.textContent = `${formatNumber(reachMin)} - ${formatNumber(reachMax)}`;
        estClicksDisplay.textContent = `${formatNumber(clickMin)} - ${formatNumber(clickMax)}`;
        
        // ROI Calculation Average
        const roiAvg = ((roiMin + roiMax) / 2).toFixed(1);
        gaugeRoiVal.textContent = `${roiAvg}x`;

        // Circular Gauge SVG Animation
        // perimeter = 2 * Math.PI * 40 = 251.2
        const maxExpectedRoi = 6.0;
        const roiPercentage = Math.min(roiAvg / maxExpectedRoi, 1);
        const dashOffset = 251.2 - (251.2 * roiPercentage);
        roiGaugeFill.style.strokeDashoffset = dashOffset;
    }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }

    budgetSlider.addEventListener('input', updateEstimator);
    platformSelect.addEventListener('change', updateEstimator);
    
    // Initial Estimator update
    updateEstimator();

    // ----------------------------------------------------
    // 5. Portfolio Tabs & Filtering
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ----------------------------------------------------
    // 6. Contact Form Processing & Success Trigger
    // ----------------------------------------------------
    const contactForm = document.getElementById('campaign-contact-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const successClose = document.getElementById('btn-success-close');

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Capture user form values (can be extended for actual integrations)
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const business = document.getElementById('form-business').value;
        const service = document.getElementById('form-service').value;
        const message = document.getElementById('form-message').value;

        // Visual check logs
        console.log("Campaign Inquiry:", { name, email, business, service, message });
        
        // Show success modal inside form panel
        successOverlay.classList.add('show');
    });

    successClose.addEventListener('click', () => {
        successOverlay.classList.remove('show');
        contactForm.reset();
        
        // Reset slider values visual representation
        updateEstimator();
    });
});
