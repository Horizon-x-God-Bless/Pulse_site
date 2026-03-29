// Simple navigation with Pulse intro loading screen
class PulseNavigation {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.init();
    }

    init() {
        // Add loading to all internal navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && this.isInternalLink(link.href) && !link.href.includes('#')) {
                e.preventDefault();
                this.navigateWithLoading(link.href);
            }
        });
    }

    isInternalLink(href) {
        // Internal links: same origin, relative paths, or non-http links
        return href.includes(window.location.origin) || 
               href.startsWith('/') || 
               (!href.includes('://') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('https://wa.me'));
    }

    navigateWithLoading(url) {
        // Don't show loading for WhatsApp links
        if (url.includes('https://wa.me')) {
            window.open(url, '_blank');
            return;
        }

        // Show the beautiful Pulse loading screen
        this.showLoading();
        
        // Navigate after a smooth delay
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    }

    showLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('active');
        }
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('active');
        }
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
    window.pulseNav = new PulseNavigation();
    
    // Hide any lingering loading screen when page fully loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.pulseNav) {
                window.pulseNav.hideLoading();
            }
        }, 500);
    });
});

// Safety timeout - always hide loading after 3 seconds
setTimeout(() => {
    if (window.pulseNav) {
        window.pulseNav.hideLoading();
    }
}, 3000);
