<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmoothAlert Pro 2.0 - Ultimate Alert & Notification Library</title>
  
  <!-- Include SmoothAlert Pro -->
  <script src="smoothalert.js"></script>
  
  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  
  <style>
    :root {
      /* Color System */
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --secondary: #8b5cf6;
      --accent: #06b6d4;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --info: #3b82f6;
      
      /* Neutrals */
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
      --gray-500: #6b7280;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --gray-900: #111827;
      
      /* Glass & Effects */
      --glass-bg: rgba(255, 255, 255, 0.1);
      --glass-border: rgba(255, 255, 255, 0.2);
      --backdrop-blur: 20px;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
      
      /* Animation */
      --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
      --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: var(--gray-800);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
    }

    /* Animated Background */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 219, 226, 0.3) 0%, transparent 50%);
      animation: backgroundMove 20s ease-in-out infinite;
      z-index: -1;
    }

    @keyframes backgroundMove {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    /* Navigation */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 80px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(var(--backdrop-blur));
      border-bottom: 1px solid var(--glass-border);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    }

    .nav-logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .nav-links a:hover {
      color: white;
    }

    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 2rem;
    }

    .hero-content {
      max-width: 800px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--glass-bg);
      backdrop-filter: blur(var(--backdrop-blur));
      border: 1px solid var(--glass-border);
      border-radius: 50px;
      padding: 0.5rem 1rem;
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 2rem;
    }

    .hero-title {
      font-size: clamp(3rem, 8vw, 6rem);
      font-weight: 900;
      color: white;
      margin-bottom: 1rem;
      line-height: 1.1;
      background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 3rem;
      line-height: 1.6;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border: none;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s var(--ease-out-quart);
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
    }

    .btn-secondary {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--backdrop-blur));
      border: 1px solid var(--glass-border);
      color: white;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    /* Demo Section */
    .demo-section {
      padding: 8rem 2rem;
      text-align: center;
    }

    .section-title {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 4rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .demo-card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--backdrop-blur));
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 2rem;
      transition: all 0.3s var(--ease-out-quart);
    }

    .demo-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary);
      box-shadow: var(--shadow-2xl);
    }

    .demo-card-icon {
      width: 60px;
      height: 60px;
      background: var(--primary);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 1.5rem;
      color: white;
    }

    .demo-card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }

    .demo-card-description {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .demo-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-small {
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      border-radius: 25px;
    }

    /* Code Section */
    .code-section {
      padding: 8rem 2rem;
      background: rgba(0, 0, 0, 0.1);
    }

    .code-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .code-tabs {
      display: flex;
      gap: 1px;
      margin-bottom: 0;
      background: var(--glass-bg);
      border-radius: 10px 10px 0 0;
      padding: 0.5rem;
    }

    .code-tab {
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .code-tab.active {
      background: var(--primary);
      color: white;
    }

    .code-block {
      background: var(--gray-900);
      border-radius: 0 0 10px 10px;
      padding: 2rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      color: #e5e7eb;
      overflow-x: auto;
      position: relative;
    }

    .code-block::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--primary), transparent);
    }

    .code-copy {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: white;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .code-copy:hover {
      background: var(--primary);
    }

    /* Features Grid */
    .features-section {
      padding: 8rem 2rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--backdrop-blur));
      border: 1px solid var(--glass-border);
      border-radius: 15px;
      padding: 2rem;
      text-align: center;
    }

    .feature-icon {
      width: 50px;
      height: 50px;
      background: var(--secondary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: white;
      font-size: 1.25rem;
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.5rem;
    }

    .feature-description {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.95rem;
    }

    /* Footer */
    .footer {
      padding: 4rem 2rem 2rem;
      text-align: center;
      border-top: 1px solid var(--glass-border);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--backdrop-blur));
    }

    .footer-text {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 1rem;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: white;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav {
        padding: 0 1rem;
      }

      .nav-links {
        display: none;
      }

      .hero {
        padding: 0 1rem;
      }

      .hero-buttons {
        flex-direction: column;
        align-items: center;
      }

      .demo-grid {
        grid-template-columns: 1fr;
      }

      .demo-buttons {
        flex-direction: column;
      }

      .code-tabs {
        flex-wrap: wrap;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Animation Classes */
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 0.8s var(--ease-out-quart) forwards;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Syntax Highlighting */
    .token.keyword { color: #c792ea; }
    .token.string { color: #c3e88d; }
    .token.function { color: #82aaff; }
    .token.number { color: #f78c6c; }
    .token.operator { color: #89ddff; }
    .token.punctuation { color: #89ddff; }
    .token.comment { color: #676e95; font-style: italic; }

    /* Loading Animation */
    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <!-- Navigation -->
  <nav class="nav">
    <a href="#" class="nav-logo">
      <i class="fas fa-rocket"></i> SmoothAlert Pro
    </a>
    <ul class="nav-links">
      <li><a href="#demo">Demo</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#code">Documentation</a></li>
      <li><a href="#examples">Examples</a></li>
    </ul>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content fade-in">
      <div class="hero-badge">
        <i class="fas fa-star"></i>
        Version 2.0 - Ultra Professional
      </div>
      <h1 class="hero-title">SmoothAlert Pro</h1>
      <p class="hero-subtitle">
        Die ultimative JavaScript-Bibliothek für moderne Alerts und Benachrichtigungen. 
        Mit Glassmorphism, Dark Mode, TypeScript-Support und professionellen Animationen.
      </p>
      <div class="hero-buttons">
        <button class="btn btn-primary" onclick="showWelcomeDemo()">
          <i class="fas fa-play"></i>
          Live Demo
        </button>
        <a href="#code" class="btn btn-secondary">
          <i class="fas fa-code"></i>
          Documentation
        </a>
      </div>
    </div>
  </section>

  <!-- Demo Section -->
  <section id="demo" class="demo-section">
    <div class="fade-in">
      <h2 class="section-title">Interaktive Demos</h2>
      <p class="section-subtitle">
        Erleben Sie die Power von SmoothAlert Pro mit unseren interaktiven Beispielen
      </p>
    </div>
    
    <div class="demo-grid">
      <!-- Basic Alert -->
      <div class="demo-card fade-in">
        <div class="demo-card-icon">
          <i class="fas fa-bell"></i>
        </div>
        <h3 class="demo-card-title">Basic Alerts</h3>
        <p class="demo-card-description">
          Elegante, glassmorphe Alerts mit modernen Animationen und responsivem Design.
        </p>
        <div class="demo-buttons">
          <button class="btn btn-primary btn-small" onclick="demoBasicAlert()">
            Info Alert
          </button>
          <button class="btn btn-secondary btn-small" onclick="demoSuccessAlert()">
            Success Alert
          </button>
        </div>
      </div>

      <!-- Advanced Modals -->
      <div class="demo-card fade-in">
        <div class="demo-card-icon">
          <i class="fas fa-window-maximize"></i>
        </div>
        <h3 class="demo-card-title">Advanced Modals</h3>
        <p class="demo-card-description">
          Komplexe Modale mit Bildern, Custom Buttons und erweiterten Styling-Optionen.
        </p>
        <div class="demo-buttons">
          <button class="btn btn-primary btn-small" onclick="demoAdvancedModal()">
            Image Modal
          </button>
          <button class="btn btn-secondary btn-small" onclick="demoConfirmModal()">
            Confirmation
          </button>
        </div>
      </div>

      <!-- Toast Notifications -->
      <div class="demo-card fade-in">
        <div class="demo-card-icon">
          <i class="fas fa-comment-dots"></i>
        </div>
        <h3 class="demo-card-title">Toast Notifications</h3>
        <p class="demo-card-description">
          Schöne Toast-Benachrichtigungen mit Progress Bar und verschiedenen Positionen.
        </p>
        <div class="demo-buttons">
          <button class="btn btn-primary btn-small" onclick="demoToast('success')">
            Success Toast
          </button>
          <button class="btn btn-secondary btn-small" onclick="demoToast('error')">
            Error Toast
          </button>
        </div>
      </div>

      <!-- Theme System -->
      <div class="demo-card fade-in">
        <div class="demo-card-icon">
          <i class="fas fa-palette"></i>
        </div>
        <h3 class="demo-card-title">Theme System</h3>
        <p class="demo-card-description">
          Integriertes Theme-System mit Dark Mode und Custom CSS-Properties.
        </p>
        <div class="demo-buttons">
          <button class="btn btn-primary btn-small" onclick="demoWarningAlert()">
            Warning Theme
          </button>
          <button class="btn btn-secondary btn-small" onclick="demoErrorAlert()">
            Error Theme
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Code Documentation -->
  <section id="code" class="code-section">
    <div class="code-container fade-in">
      <h2 class="section-title" style="text-align: center; margin-bottom: 4rem;">Documentation</h2>
      
      <div class="code-tabs">
        <button class="code-tab active" onclick="switchTab('installation')">Installation</button>
        <button class="code-tab" onclick="switchTab('basic')">Basic Usage</button>
        <button class="code-tab" onclick="switchTab('advanced')">Advanced</button>
        <button class="code-tab" onclick="switchTab('api')">API Reference</button>
      </div>

      <div id="installation-code" class="code-block">
        <button class="code-copy" onclick="copyCode('installation')">
          <i class="fas fa-copy"></i>
        </button>
        <pre><code class="language-html">&lt;!-- CDN Installation --&gt;
&lt;script src="https://smoothalert.pro/smoothalert.min.js"&gt;&lt;/script&gt;

&lt;!-- NPM Installation --&gt;
npm install smoothalert-pro

&lt;!-- ES6 Import --&gt;
import SmoothAlert from 'smoothalert-pro';</code></pre>
      </div>

      <div id="basic-code" class="code-block" style="display: none;">
        <button class="code-copy" onclick="copyCode('basic')">
          <i class="fas fa-copy"></i>
        </button>
        <pre><code class="language-javascript">// Basic Alert
SmoothAlert.alert('Hello World!');

// Success Alert
SmoothAlert.success('Operation completed successfully!');

// Error Alert
SmoothAlert.error('Something went wrong!');

// Warning Alert
SmoothAlert.warning('Please be careful!');

// Toast Notification
SmoothAlert.toast('Quick notification!', {
  type: 'info',
  position: 'top-right'
});</code></pre>
      </div>

      <div id="advanced-code" class="code-block" style="display: none;">
        <button class="code-copy" onclick="copyCode('advanced')">
          <i class="fas fa-copy"></i>
        </button>
        <pre><code class="language-javascript">// Advanced Modal with Image and Custom Buttons
SmoothAlert.alert('Welcome to SmoothAlert Pro!', {
  title: 'Premium Experience',
  type: 'success',
  imageUrl: 'https://example.com/image.jpg',
  buttons: [
    {
      label: 'Get Started',
      style: 'primary',
      action: (modalId) => {
        SmoothAlert.toast('Welcome aboard!', { type: 'success' });
        SmoothAlert.closeModal(modalId);
      }
    },
    {
      label: 'Maybe Later',
      style: 'secondary',
      action: 'close'
    }
  ],
  customStyles: {
    modal: { borderRadius: '20px' },
    title: { color: '#10b981' },
    image: { borderRadius: '50%', width: '120px', height: '120px' }
  }
});</code></pre>
      </div>

      <div id="api-code" class="code-block" style="display: none;">
        <button class="code-copy" onclick="copyCode('api')">
          <i class="fas fa-copy"></i>
        </button>
        <pre><code class="language-javascript">// Complete API Reference
SmoothAlert = {
  // Modal Methods
  alert(message, options),
  success(message, options),
  error(message, options),
  warning(message, options),
  confirm(message, options), // Returns Promise

  // Toast Methods
  toast(message, options),

  // Utility Methods
  closeAll(),
  setTheme(theme),

  // Options Object
  options: {
    title: 'string',
    message: 'string',
    type: 'info|success|error|warning',
    imageUrl: 'string',
    buttons: [{ label, style, action }],
    autoClose: boolean,
    autoCloseDuration: number,
    position: 'center|top-left|top-right|...',
    customStyles: { modal, title, message, button, image },
    showCloseButton: boolean,
    backdropClose: boolean,
    animation: boolean
  }
};</code></pre>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="features-section">
    <div class="fade-in">
      <h2 class="section-title" style="text-align: center;">Ultimative Features</h2>
      <p class="section-subtitle" style="text-align: center;">
        Alles was Sie für professionelle Benachrichtigungen brauchen
      </p>
    </div>

    <div class="features-grid">
      <div class="feature-card fade-in">
        <div class="feature-icon">
          <i class="fas fa-magic"></i>
        </div>
        <h3 class="feature-title">Glassmorphism Design</h3>
        <p class="feature-description">Moderne glassmorphe UI mit Backdrop-Filter und eleganten Transparenz-Effekten.</p>
      </div>

      <div class="feature-card fade-in">
        <div class="feature-icon">
          <i class="fas fa-mobile-alt"></i>
        </div>
        <h3 class="feature-title">Mobile First</h3>
        <p class="feature-description">Vollständig responsive und für mobile Geräte optimiert mit Touch-Gesten.</p>
      </div>

      <div class="feature-card fade-in">
        <div class="feature-icon">
          <i class="fas fa-rocket"></i>
        </div>
        <h3 class="feature-title">Performance Optimiert</h3>
        <p class="feature-description">Minimale Bundle-Größe, lazy loading und optimierte Animationen für beste Performance.</p>
      </div>

      <div class="feature-card fade-in">
        <div class="feature-icon">
          <i class="fas fa-code"></i>
        </div>
        <h3 class="feature-title">TypeScript Ready</h3>
        <p class="feature-description">Vollständige TypeScript-Unterstützung mit Typdefinitionen und IntelliSense.</p>
      </div>

      <div class="feature-card fade-in">
        <div class="feature-icon">
          <i class="fas fa-universal-access"></i>
        </div>
        <h3 class="feature-title">Accessibility</h3>
        <p class="feature-description">ARIA-Labels, Keyboard-Navigation und Screen-Reader-Unterstützung.</p>
      </div>

      <div class="feature-card fade-in">
        <div class="feature-icon">
          <i class="fas fa-cogs"></i>
        </div>
        <h3 class="feature-title">Hochgradig Anpassbar</h3>
        <p class="feature-description">Umfangreiche Customization-Optionen mit CSS-Variables und Custom Styles.</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <p class="footer-text">© 2024 SmoothAlert Pro. Made with ❤️ für die Developer Community.</p>
    <div class="footer-links">
      <a href="#"><i class="fab fa-github"></i> GitHub</a>
      <a href="#"><i class="fas fa-book"></i> Docs</a>
      <a href="#"><i class="fas fa-bug"></i> Issues</a>
      <a href="#"><i class="fas fa-heart"></i> Support</a>
    </div>
  </footer>

  <script>
    // Demo Functions
    function showWelcomeDemo() {
      SmoothAlert.success('🚀 Willkommen bei SmoothAlert Pro 2.0!', {
        title: 'Premium Experience',
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop&crop=face',
        buttons: [
          {
            label: 'Awesome!',
            style: 'success',
            action: (modalId) => {
              SmoothAlert.toast('Danke! 🎉', { type: 'success' });
            }
          },
          {
            label: 'Show Features',
            style: 'primary',
            action: (modalId) => {
              document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            }
          }
        ]
      });
    }

    function demoBasicAlert() {
      SmoothAlert.alert('Dies ist eine moderne, glassmorphe Alert! ✨', {
        title: 'Info Alert',
        type: 'info'
      });
    }

    function demoSuccessAlert() {
      SmoothAlert.success('Operation erfolgreich abgeschlossen! 🎉', {
        title: 'Erfolg!',
        autoClose: true,
        autoCloseDuration: 3000
      });
    }

    function demoAdvancedModal() {
      SmoothAlert.alert('Schauen Sie sich dieses schöne Modal mit Bild an!', {
        title: 'Advanced Modal',
        type: 'info',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
        buttons: [
          {
            label: 'Super!',
            style: 'primary',
            action: 'close'
          },
          {
            label: 'Mehr Features',
            style: 'secondary',
            action: (modalId) => {
              SmoothAlert.toast('Entdecken Sie alle Features! 🚀', { type: 'info' });
            }
          }
        ],
        customStyles: {
          image: { borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }
        }
      });
    }

    function demoConfirmModal() {
      SmoothAlert.confirm('Möchten Sie diese Aktion wirklich ausführen?', {
        title: 'Bestätigung erforderlich',
        type: 'warning'
      }).then(confirmed => {
        if (confirmed) {
          SmoothAlert.toast('Bestätigt! ✅', { type: 'success' });
        } else {
          SmoothAlert.toast('Abgebrochen! ❌', { type: 'error' });
        }
      });
    }

    function demoToast(type) {
      const messages = {
        success: 'Erfolgreich gespeichert! 🎉',
        error: 'Ein Fehler ist aufgetreten! ❌',
        warning: 'Warnung: Bitte beachten! ⚠️',
        info: 'Neue Nachricht erhalten! 💬'
      };

      SmoothAlert.toast(messages[type] || messages.info, {
        type: type,
        position: 'top-right',
        duration: 4000
      });
    }

    function demoWarningAlert() {
      SmoothAlert.warning('Dies ist eine Warnung mit custom Styling! ⚠️', {
        title: 'Achtung!',
        customStyles: {
          title: { color: '#f59e0b', fontSize: '1.8em' },
          modal: { border: '2px solid #f59e0b' }
        }
      });
    }

    function demoErrorAlert() {
      SmoothAlert.error('Ein kritischer Fehler ist aufgetreten! 🔥', {
        title: 'System Error',
        buttons: [
          {
            label: 'Retry',
            style: 'warning',
            action: (modalId) => {
              SmoothAlert.toast('Versuche erneut...', { type: 'info' });
            }
          },
          {
            label: 'Report Bug',
            style: 'secondary',
            action: (modalId) => {
              SmoothAlert.toast('Bug gemeldet! 📝', { type: 'success' });
            }
          }
        ]
      });
    }

    // Tab System
    function switchTab(tabName) {
      // Hide all code blocks
      document.querySelectorAll('.code-block').forEach(block => {
        block.style.display = 'none';
      });
      
      // Remove active class from all tabs
      document.querySelectorAll('.code-tab').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show selected code block
      document.getElementById(tabName + '-code').style.display = 'block';
      
      // Add active class to clicked tab
      event.target.classList.add('active');
    }

    // Copy to clipboard
    function copyCode(tabName) {
      const codeBlock = document.querySelector(`#${tabName}-code pre code`);
      const text = codeBlock.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        SmoothAlert.toast('Code in Zwischenablage kopiert! 📋', {
          type: 'success',
          duration: 2000
        });
      });
    }

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = '0s';
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
      });
    });

    // Auto-demo on page load
    setTimeout(() => {
      SmoothAlert.toast('🎉 SmoothAlert Pro 2.0 ist geladen und bereit!', {
        type: 'success',
        position: 'bottom-right',
        duration: 5000
      });
    }, 1000);
  </script>
</body>
</html>
