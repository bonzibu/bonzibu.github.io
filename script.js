// Page Navigation
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(pageName).classList.add('active');
    event.target.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-trigger scroll animations for newly visible page
    setTimeout(() => {
        revealOnScroll();
    }, 100);
}

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#home' && href !== '#apps' && href !== '#socials' && href !== '#support') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
