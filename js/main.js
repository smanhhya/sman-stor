// --- دوال الألوان (Themes) ---
function updateThemeColor(cssVar, colorHex, storageKey) {
    document.documentElement.style.setProperty(cssVar, colorHex);
    localStorage.setItem(storageKey, colorHex);
}

function resetThemeColors() {
    const defaults = { '--brand-navy': '#1b4332', '--brand-cyanDark': '#b91c1c', '--brand-yellow': '#f59e0b' };
    document.getElementById('color-navy').value = defaults['--brand-navy'];
    document.getElementById('color-cyanDark').value = defaults['--brand-cyanDark'];
    document.getElementById('color-yellow').value = defaults['--brand-yellow'];
    for (const [cssVar, color] of Object.entries(defaults)) {
        document.documentElement.style.setProperty(cssVar, color);
        localStorage.removeItem(cssVar.replace('--brand-', 'theme_'));
    }
    alert('تم استعادة ألوان سمان ههيا الافتراضية بنجاح!');
}

// -- برمجة السلايدر المتقدمة --
window.currentSlide = 0;
window.sliderImages = []; 

window.moveSlider = function(direction) {
    if(window.sliderImages.length <= 1) return;
    window.currentSlide = (window.currentSlide + direction + window.sliderImages.length) % window.sliderImages.length;
    window.updateSliderView();
}

window.updateSliderView = function() {
    const track = document.getElementById('slider-track');
    if(track) track.style.transform = `translateX(${window.currentSlide * 100}%)`;
    
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.className = `slider-dot h-2 w-2 rounded-full transition-all duration-300 ${index === window.currentSlide ? 'active' : 'bg-gray-300'}`;
    });
}

// تفعيل السحب للإصبع على الموبايل
document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderViewport = document.getElementById('slider-viewport');
    if(sliderViewport) {
        sliderViewport.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        sliderViewport.addEventListener('touchend', e => { 
            touchEndX = e.changedTouches[0].screenX; 
            if(touchEndX < touchStartX - 30) window.moveSlider(-1); 
            if(touchEndX > touchStartX + 30) window.moveSlider(1);  
        }, {passive: true});
    }
});

// -- إعدادات تثبيت التطبيق PWA --
let deferredPrompt;
const installBtn = document.getElementById('install-app-btn');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Sman Hhya App Registered! ✅'))
        .catch(err => console.log('PWA Error:', err));
    });
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); 
    deferredPrompt = e; 
    if(installBtn) installBtn.classList.remove('hidden'); 
});

if(installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); 
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null; 
            installBtn.classList.add('hidden'); 
        }
    });
}

window.addEventListener('appinstalled', () => {
    if(installBtn) installBtn.classList.add('hidden');
    deferredPrompt = null;
});
