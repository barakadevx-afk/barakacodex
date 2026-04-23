// ========================================
// Baraka Codex - Online Coding Learning Platform
// Pure HTML, CSS, JavaScript - No Build Tools Required
// ========================================

// ========================================
// SUPABASE CONFIGURATION (VANILLA JS)
// ========================================
const SUPABASE_URL = 'https://poyzhoxnvbfumgtcklia.supabase.co';
const SUPABASE_KEY = 'sb_publishable_riXA6qvXzB6Bo3z8bJYRUg_D4E8fVWV';

// Initialize Supabase client from CDN
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// ========================================
// SUPABASE HELPER FUNCTIONS
// ========================================

async function signUp(email, password, metadata = {}) {
    return await supabaseClient.auth.signUp({ email, password, options: { data: metadata } });
}

async function signIn(email, password) {
    return await supabaseClient.auth.signInWithPassword({ email, password });
}

async function signOut() {
    return await supabaseClient.auth.signOut();
}

async function getCurrentUser() {
    return await supabaseClient.auth.getUser();
}

async function getSession() {
    return await supabaseClient.auth.getSession();
}

async function getCourses() {
    return await supabaseClient.from('courses').select('*').order('created_at', { ascending: false });
}

async function enrollInCourse(userId, courseId) {
    return await supabaseClient.from('enrollments').insert({
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString()
    });
}

async function subscribeToNewsletter(email) {
    return await supabaseClient.from('newsletter_subscribers').insert({
        email: email,
        subscribed_at: new Date().toISOString()
    });
}

async function initializeAuth() {
    const { data: { session }, error } = await getSession();
    if (error) {
        console.error('❌ Auth initialization error:', error);
        return null;
    }
    return session ? session.user : null;
}

// Auth state listener
supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth state changed:', event);
    switch (event) {
        case 'SIGNED_IN':
            console.log('✅ User signed in:', session.user.email);
            break;
        case 'SIGNED_OUT':
            console.log('👋 User signed out');
            break;
    }
});

// ========================================
// DOM Elements
// ========================================
const loader = document.getElementById('loader');
const progressBar = document.getElementById('progressBar');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const filterTabs = document.querySelectorAll('.filter-tab');
const courseCards = document.querySelectorAll('.course-card');
const backToTop = document.getElementById('backToTop');
const newsletterForm = document.getElementById('newsletterForm');

// ========================================
// LOADER
// ========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 800);
});

// ========================================
// PROGRESS BAR
// ========================================
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ========================================
// THEME TOGGLE
// ========================================
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ========================================
// NAVIGATION
// ========================================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    if (scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================
// COURSE FILTERING
// ========================================
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        filterCourses(filter);
    });
});

function filterCourses(filter) {
    courseCards.forEach(card => {
        const level = card.dataset.level;
        
        if (filter === 'all' || level === filter) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ========================================
// NEWSLETTER FORM - SUPABASE INTEGRATION
// ========================================
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const email = emailInput.value.trim();
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    
    try {
        // Subscribe via Supabase
        const { data, error } = await subscribeToNewsletter(email);
        
        if (error) {
            throw error;
        }
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        showNotification('Welcome to Baraka Codex! Check your email for confirmation.', 'success');
        newsletterForm.reset();
        
        // Log to Supabase analytics
        console.log('📧 Newsletter subscription:', email);
        
    } catch (error) {
        console.error('❌ Subscription error:', error);
        submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
        
        if (error.message.includes('duplicate')) {
            showNotification('You\'re already subscribed! 🎉', 'success');
        } else {
            showNotification('Something went wrong. Please try again.', 'error');
        }
    } finally {
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 3000);
    }
});

// ========================================
// NOTIFICATION
// ========================================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
const revealElements = document.querySelectorAll('.course-card, .path-card, .tutorial-card, .section-header');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ========================================
// PLAY BUTTON CLICK
// ========================================
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showNotification('Course preview coming soon!', 'success');
    });
});

// ========================================
// PATH CARD CLICKS
// ========================================
document.querySelectorAll('.path-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Learning path coming soon!', 'success');
    });
});

// ========================================
// TUTORIAL CARD CLICKS
// ========================================
document.querySelectorAll('.tutorial-card').forEach(card => {
    card.addEventListener('click', () => {
        showNotification('Tutorial opening in new tab...', 'success');
    });
    card.style.cursor = 'pointer';
});

// ========================================
// ADD ANIMATION STYLES
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========================================
// SUPABASE INITIALIZATION
// ========================================

async function initSupabase() {
    try {
        // Initialize auth state
        const user = await initializeAuth()
        
        if (user) {
            // User is logged in - update UI
            console.log('✅ User authenticated:', user.email)
            // TODO: Update navbar to show user avatar/name
            // TODO: Load user progress
        } else {
            console.log('👤 No active session')
        }
        
        // Load courses from Supabase
        const { data: courses, error } = await getCourses()
        if (courses) {
            console.log('📚 Courses loaded:', courses.length)
            // TODO: Dynamically render courses
        }
        
    } catch (error) {
        console.error('❌ Supabase initialization error:', error)
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSupabase)

// ========================================
// TRY IT EDITOR FUNCTIONS
// ========================================

const codeExamples = {
    'html-basic': {
        html: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first web page.</p>
    <button onclick="alert('Welcome!')">Click Me</button>
</body>
</html>`,
        css: `body {
    font-family: Arial, sans-serif;
    padding: 20px;
    background: #f0f0f0;
}

h1 {
    color: #6366f1;
}

button {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}`,
        js: `// JavaScript runs automatically
console.log('Page loaded!');

// You can add interactivity here
function greet(name) {
    return 'Hello, ' + name + '!';
}`
    }
};

function openTryIt(exampleId) {
    const modal = document.getElementById('tryitModal');
    const htmlCode = document.getElementById('htmlCode');
    const cssCode = document.getElementById('cssCode');
    const jsCode = document.getElementById('jsCode');
    
    const example = codeExamples[exampleId] || codeExamples['html-basic'];
    
    htmlCode.value = example.html;
    cssCode.value = example.css;
    jsCode.value = example.js;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Run code immediately
    runCode();
}

function closeTryIt() {
    const modal = document.getElementById('tryitModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function runCode() {
    const html = document.getElementById('htmlCode').value;
    const css = document.getElementById('cssCode').value;
    const js = document.getElementById('jsCode').value;
    
    const frame = document.getElementById('previewFrame');
    const doc = frame.contentDocument || frame.contentWindow.document;
    
    const fullCode = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `;
    
    doc.open();
    doc.write(fullCode);
    doc.close();
}

// Tab switching in Try-It editor
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tab + 'Code').classList.add('active');
    });
});

// Close modal on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTryIt();
    }
});

// ========================================
// TUTORIALS PAGE SIDEBAR
// ========================================

const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking on a link (mobile)
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// Tutorial search
document.getElementById('tutorialSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const links = document.querySelectorAll('.menu-section li a');
    
    links.forEach(link => {
        const text = link.textContent.toLowerCase();
        link.parentElement.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
});

// ========================================
// CONSOLE MESSAGE
// ========================================
console.log('%c🚀 Welcome to Baraka Codex!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cPowered by Supabase ⚡', 'font-size: 14px; color: #3ecf8e;');
console.log('%cStart your coding journey today!', 'font-size: 14px; color: #64748b;');
console.log('%cHappy Learning! 💻', 'font-size: 14px; color: #10b981;');

// Special message for tutorials page
if (document.querySelector('.tutorials-layout')) {
    console.log('%c📚 Tutorials Mode Active', 'font-size: 14px; color: #f59e0b;');
    console.log('%cTry the code editor! Click "Try it Yourself" buttons', 'font-size: 12px; color: #64748b;');
}
