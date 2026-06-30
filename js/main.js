document.addEventListener('DOMContentLoaded', () => {
    // AOS Initialization
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Navbar Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navDropdowns = document.querySelectorAll('.nav-item-dropdown');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    navDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                // Prevent default behavior only if clicking the link itself, not the dropdown content
                if (e.target.classList.contains('nav-link') || e.target.closest('.nav-link')) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            }
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const htmlElement = document.documentElement;
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Set initial state
    if (isDarkMode) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateDarkModeIcon(true);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                htmlElement.removeAttribute('data-theme');
                localStorage.setItem('darkMode', 'false');
                updateDarkModeIcon(false);
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('darkMode', 'true');
                updateDarkModeIcon(true);
            }
        });
    }

    function updateDarkModeIcon(isDark) {
        if (!darkModeToggle) return;
        const icon = darkModeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Color Selector
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', function() {
            // Remove active from siblings
            const parent = this.closest('.color-selector');
            parent.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');

            // Change Image
            const imgPath = this.getAttribute('data-image');
            const targetId = this.getAttribute('data-target');
            const imgElement = document.getElementById(targetId);
            
            if (imgPath && imgElement) {
                // Simple crossfade effect
                imgElement.style.opacity = 0;
                setTimeout(() => {
                    imgElement.src = imgPath;
                    imgElement.style.opacity = 1;
                }, 300);
            }
        });
    });
});
