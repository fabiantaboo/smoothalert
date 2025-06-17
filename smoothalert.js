/**
 * SmoothAlert Pro v2.0 - Ultra Professional Alert & Notification Library
 * Modern, Lightweight, Performance-Optimized
 * Features: Glassmorphism, Dark Mode, Advanced Animations, TypeScript Ready
 * Author: SmoothAlert Team
 * License: MIT
 */

class SmoothAlertEngine {
  constructor() {
    // Use WeakMap for memory leak prevention
    this.elementMetadata = new WeakMap();
    this.eventListeners = new WeakMap();
    this.animationFrames = new Set();
    this.timeouts = new Set();
    this.intervals = new Set();
    
    // Active instances tracking
    this.activeModals = new Set();
    this.activeToasts = new Map();
    
    // Performance monitoring
    this.performanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      totalModalsCreated: 0,
      activeModals: 0
    };
    
    // Configuration
    this.config = {
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      theme: 'modern',
      lazyStyleInjection: true,
      enablePerformanceMonitoring: true
    };
    
    // Style injection status
    this.stylesInjected = false;
    this.stylePromise = null;
    
    this.initializeEngine();
  }

  initializeEngine() {
    this.detectMobileDevice();
    this.setupEventListeners();
    this.setupPerformanceMonitoring();
    
    // Lazy load styles only when needed
    if (!this.config.lazyStyleInjection) {
      this.injectStyles();
    }
  }

  detectMobileDevice() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  setupPerformanceMonitoring() {
    if (!this.config.enablePerformanceMonitoring) return;
    
    // Monitor memory usage periodically
    if (performance.memory) {
      const monitorMemory = () => {
        this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
        this.performanceMetrics.activeModals = this.activeModals.size;
      };
      
      const intervalId = setInterval(monitorMemory, 5000);
      this.intervals.add(intervalId);
    }
  }

  // Lazy Style Injection
  async injectStyles() {
    if (this.stylesInjected) return Promise.resolve();
    if (this.stylePromise) return this.stylePromise;

    this.stylePromise = new Promise((resolve) => {
      const styleId = 'smoothalert-pro-styles';
      if (document.getElementById(styleId)) {
        this.stylesInjected = true;
        resolve();
        return;
      }

      // Performance timing
      const startTime = performance.now();

      const styles = `
        <style id="${styleId}">
          :root {
            --sa-primary: #6366f1;
            --sa-success: #10b981;
            --sa-warning: #f59e0b;
            --sa-error: #ef4444;
            --sa-info: #3b82f6;
            --sa-dark: #1f2937;
            --sa-light: #f9fafb;
            --sa-glass-bg: rgba(255, 255, 255, 0.1);
            --sa-glass-border: rgba(255, 255, 255, 0.2);
            --sa-backdrop: rgba(0, 0, 0, 0.5);
            --sa-shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            --sa-shadow-xl: 0 35px 60px -12px rgba(0, 0, 0, 0.35);
            --sa-blur: 16px;
          }

          .smoothalert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--sa-backdrop);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity;
          }

          .smoothalert-overlay.show {
            opacity: 1;
          }

          .smoothalert-modal {
            background: var(--sa-glass-bg);
            backdrop-filter: blur(var(--sa-blur));
            -webkit-backdrop-filter: blur(var(--sa-blur));
            border: 1px solid var(--sa-glass-border);
            border-radius: 24px;
            padding: 32px;
            max-width: 90vw;
            max-height: 90vh;
            width: 440px;
            box-shadow: var(--sa-shadow-xl);
            position: relative;
            transform: scale(0.8) translateY(20px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
            will-change: transform, opacity;
          }

          .smoothalert-modal.show {
            transform: scale(1) translateY(0);
            opacity: 1;
          }

          .smoothalert-modal::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--sa-glass-border), transparent);
          }

          .smoothalert-close {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.8);
            font-size: 18px;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
            will-change: transform, background-color;
          }

          .smoothalert-close:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            transform: scale(1.1);
          }

          .smoothalert-image {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            object-fit: cover;
            margin: 0 auto 20px;
            display: block;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .smoothalert-title {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin: 0 0 12px;
            text-align: center;
            line-height: 1.3;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .smoothalert-message {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            margin: 0 0 28px;
            text-align: center;
            line-height: 1.6;
          }

          .smoothalert-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .smoothalert-button {
            padding: 12px 24px;
            border: none;
            border-radius: 50px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            min-width: 100px;
            background: var(--sa-primary);
            color: white;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            will-change: transform, box-shadow;
          }

          .smoothalert-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }

          .smoothalert-button:hover::before {
            left: 100%;
          }

          .smoothalert-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
          }

          .smoothalert-button.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: none;
          }

          .smoothalert-button.secondary:hover {
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
          }

          .smoothalert-button.success {
            background: var(--sa-success);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          }

          .smoothalert-button.warning {
            background: var(--sa-warning);
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
          }

          .smoothalert-button.error {
            background: var(--sa-error);
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
          }

          /* Toast Styles */
          .smoothalert-toast-container {
            position: fixed;
            z-index: 1000000;
            pointer-events: none;
          }

          .smoothalert-toast-container.top-right {
            top: 20px;
            right: 20px;
          }

          .smoothalert-toast-container.top-left {
            top: 20px;
            left: 20px;
          }

          .smoothalert-toast-container.top-center {
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
          }

          .smoothalert-toast-container.bottom-right {
            bottom: 20px;
            right: 20px;
          }

          .smoothalert-toast-container.bottom-left {
            bottom: 20px;
            left: 20px;
          }

          .smoothalert-toast-container.bottom-center {
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
          }

          .smoothalert-toast {
            background: var(--sa-glass-bg);
            backdrop-filter: blur(var(--sa-blur));
            -webkit-backdrop-filter: blur(var(--sa-blur));
            border: 1px solid var(--sa-glass-border);
            border-radius: 16px;
            padding: 16px 20px;
            margin-bottom: 12px;
            max-width: 400px;
            min-width: 300px;
            box-shadow: var(--sa-shadow-lg);
            color: white;
            font-size: 14px;
            line-height: 1.5;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: all;
            position: relative;
            overflow: hidden;
            will-change: transform, opacity;
          }

          .smoothalert-toast.show {
            transform: translateX(0);
            opacity: 1;
          }

          .smoothalert-toast.left {
            transform: translateX(-100%);
          }

          .smoothalert-toast.left.show {
            transform: translateX(0);
          }

          .smoothalert-toast.center {
            transform: translateY(-100%);
          }

          .smoothalert-toast.center.show {
            transform: translateY(0);
          }

          .smoothalert-toast::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--sa-primary);
          }

          .smoothalert-toast.success::before {
            background: var(--sa-success);
          }

          .smoothalert-toast.warning::before {
            background: var(--sa-warning);
          }

          .smoothalert-toast.error::before {
            background: var(--sa-error);
          }

          .smoothalert-toast.info::before {
            background: var(--sa-info);
          }

          .smoothalert-toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(255, 255, 255, 0.3);
            width: 100%;
            transform-origin: left;
            animation: toast-progress linear;
          }

          .smoothalert-toast-close {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            transition: all 0.2s ease;
          }

          .smoothalert-toast-close:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
          }

          @keyframes toast-progress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
          }

          /* Mobile Optimizations */
          @media (max-width: 768px) {
            .smoothalert-modal {
              width: 95vw;
              padding: 24px;
              border-radius: 20px;
            }

            .smoothalert-title {
              font-size: 20px;
            }

            .smoothalert-message {
              font-size: 15px;
            }

            .smoothalert-button {
              padding: 14px 20px;
              font-size: 16px;
              min-width: 120px;
            }

            .smoothalert-toast {
              max-width: 95vw;
              min-width: 280px;
              margin-left: 10px;
              margin-right: 10px;
            }

            .smoothalert-toast-container.top-right,
            .smoothalert-toast-container.bottom-right {
              right: 10px;
            }

            .smoothalert-toast-container.top-left,
            .smoothalert-toast-container.bottom-left {
              left: 10px;
            }
          }

          /* Dark mode styles */
          @media (prefers-color-scheme: dark) {
            :root {
              --sa-glass-bg: rgba(0, 0, 0, 0.3);
              --sa-glass-border: rgba(255, 255, 255, 0.1);
            }
          }

          /* Reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .smoothalert-overlay,
            .smoothalert-modal,
            .smoothalert-toast,
            .smoothalert-button {
              transition: none !important;
              animation: none !important;
            }
          }
        </style>
      `;

      // Use requestAnimationFrame for smooth injection
      const frameId = requestAnimationFrame(() => {
        document.head.insertAdjacentHTML('beforeend', styles);
        this.stylesInjected = true;
        
        // Record performance
        const endTime = performance.now();
        this.performanceMetrics.renderTime = endTime - startTime;
        
        this.animationFrames.delete(frameId);
        resolve();
      });
      
      this.animationFrames.add(frameId);
    });

    return this.stylePromise;
  }

  // Memory-safe event listener management
  setupEventListeners() {
    const handleKeydown = (e) => {
      if (e.key === 'Escape' && this.activeModals.size > 0) {
        const lastModal = Array.from(this.activeModals).pop();
        this.closeModal(lastModal);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animations when page is hidden to save resources
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Store listeners for cleanup
    this.eventListeners.set(document, [
      { event: 'keydown', handler: handleKeydown },
      { event: 'visibilitychange', handler: handleVisibilityChange }
    ]);
  }

  pauseAnimations() {
    document.querySelectorAll('.smoothalert-toast-progress').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }

  resumeAnimations() {
    document.querySelectorAll('.smoothalert-toast-progress').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }

  generateId() {
    return `sa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Enhanced modal creation with memory management
  async createModal(options = {}) {
    // Ensure styles are loaded before creating modal
    await this.injectStyles();

    const startTime = performance.now();
    
    const defaults = {
      title: '',
      message: '',
      type: 'info',
      buttons: [{ label: 'OK', style: 'primary', action: 'close' }],
      showCloseButton: true,
      imageUrl: null,
      customStyles: {},
      className: ''
    };

    const config = { ...defaults, ...options };
    const modalId = config.id || this.generateId();

    // Prevent duplicate modals
    if (this.activeModals.has(modalId)) {
      return modalId;
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'smoothalert-overlay';
    overlay.id = `overlay-${modalId}`;

    // Create modal
    const modal = document.createElement('div');
    modal.className = `smoothalert-modal ${config.className}`;
    modal.id = modalId;

    // Store metadata for cleanup
    this.elementMetadata.set(overlay, {
      type: 'modal',
      id: modalId,
      createdAt: Date.now()
    });

    this.elementMetadata.set(modal, {
      type: 'modal-content',
      id: modalId,
      createdAt: Date.now()
    });

    // Apply custom styles
    if (config.customStyles.modal) {
      Object.assign(modal.style, config.customStyles.modal);
    }

    // Create content
    let content = '';

    if (config.imageUrl) {
      content += `<img src="${config.imageUrl}" alt="Alert Image" class="smoothalert-image">`;
    }

    if (config.title) {
      content += `<h3 class="smoothalert-title">${config.title}</h3>`;
    }

    if (config.message) {
      content += `<p class="smoothalert-message">${config.message}</p>`;
    }

    // Create buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'smoothalert-buttons';

    config.buttons.forEach((buttonConfig, index) => {
      const button = document.createElement('button');
      button.className = `smoothalert-button ${buttonConfig.style || 'primary'}`;
      button.textContent = buttonConfig.label;
      button.onclick = () => {
        if (typeof buttonConfig.action === 'function') {
          buttonConfig.action(modalId);
        } else if (buttonConfig.action === 'close') {
          this.closeModal(modalId);
        }
      };

      // Store button metadata
      this.elementMetadata.set(button, {
        type: 'button',
        modalId: modalId,
        index: index
      });

      buttonsContainer.appendChild(button);
    });

    // Add close button
    if (config.showCloseButton) {
      const closeButton = document.createElement('div');
      closeButton.className = 'smoothalert-close';
      closeButton.innerHTML = '&times;';
      closeButton.onclick = () => this.closeModal(modalId);

      this.elementMetadata.set(closeButton, {
        type: 'close-button',
        modalId: modalId
      });

      modal.appendChild(closeButton);
    }

    modal.innerHTML = content;
    modal.appendChild(buttonsContainer);
    overlay.appendChild(modal);

    // Add backdrop close
    overlay.onclick = (e) => {
      if (e.target === overlay && config.backdropClose !== false) {
        this.closeModal(modalId);
      }
    };

    document.body.appendChild(overlay);

    // Add to active modals
    this.activeModals.add(modalId);
    this.performanceMetrics.totalModalsCreated++;

    // Show with animation
    const showFrameId = requestAnimationFrame(() => {
      overlay.classList.add('show');
      
      const modalFrameId = requestAnimationFrame(() => {
        modal.classList.add('show');
        this.animationFrames.delete(modalFrameId);
      });
      
      this.animationFrames.add(modalFrameId);
      this.animationFrames.delete(showFrameId);
    });
    
    this.animationFrames.add(showFrameId);

    // Performance tracking
    const endTime = performance.now();
    this.performanceMetrics.renderTime = Math.max(
      this.performanceMetrics.renderTime,
      endTime - startTime
    );

    return modalId;
  }

  // Memory-safe modal closing
  closeModal(modalId) {
    if (!this.activeModals.has(modalId)) return false;

    const overlay = document.getElementById(`overlay-${modalId}`);
    const modal = document.getElementById(modalId);

    if (!overlay || !modal) return false;

    // Animate out
    modal.classList.remove('show');
    
    const timeoutId = setTimeout(() => {
      overlay.classList.remove('show');
      
      const removeTimeoutId = setTimeout(() => {
        // Clean up event listeners
        this.cleanupElement(overlay);
        this.cleanupElement(modal);
        
        // Remove from DOM
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        
        // Remove from active modals
        this.activeModals.delete(modalId);
        
        // Clear timeouts
        this.timeouts.delete(timeoutId);
        this.timeouts.delete(removeTimeoutId);
      }, 300);
      
      this.timeouts.add(removeTimeoutId);
    }, 100);
    
    this.timeouts.add(timeoutId);

    return true;
  }

  // Element cleanup for memory leak prevention
  cleanupElement(element) {
    if (!element) return;

    // Clean up metadata
    this.elementMetadata.delete(element);

    // Clean up child elements
    const children = element.querySelectorAll('*');
    children.forEach(child => {
      this.elementMetadata.delete(child);
    });

    // Remove all event listeners
    element.onclick = null;
    element.onmousedown = null;
    element.onmouseup = null;
    element.onmouseover = null;
    element.onmouseout = null;
  }

  // Enhanced toast creation with lazy loading
  async createToast(message, options = {}) {
    await this.injectStyles();

    const defaults = {
      type: 'info',
      duration: 5000,
      position: 'top-right',
      showCloseButton: true,
      showProgress: true
    };

    const config = { ...defaults, ...options };
    const toastId = config.id || this.generateId();

    // Get or create container
    let container = document.querySelector(`.smoothalert-toast-container.${config.position}`);
    if (!container) {
      container = document.createElement('div');
      container.className = `smoothalert-toast-container ${config.position}`;
      document.body.appendChild(container);
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `smoothalert-toast ${config.type}`;
    toast.id = toastId;
    toast.textContent = message;

    // Position classes for animation
    if (config.position.includes('left')) {
      toast.classList.add('left');
    } else if (config.position.includes('center')) {
      toast.classList.add('center');
    }

    // Store metadata
    this.elementMetadata.set(toast, {
      type: 'toast',
      id: toastId,
      position: config.position,
      createdAt: Date.now()
    });

    // Add close button
    if (config.showCloseButton) {
      const closeButton = document.createElement('div');
      closeButton.className = 'smoothalert-toast-close';
      closeButton.innerHTML = '&times;';
      closeButton.onclick = () => this.closeToast(toastId, config.position);
      toast.appendChild(closeButton);
    }

    // Add progress bar
    if (config.showProgress) {
      const progress = document.createElement('div');
      progress.className = 'smoothalert-toast-progress';
      progress.style.animationDuration = `${config.duration}ms`;
      toast.appendChild(progress);
    }

    container.appendChild(toast);

    // Track active toast
    if (!this.activeToasts.has(config.position)) {
      this.activeToasts.set(config.position, new Set());
    }
    this.activeToasts.get(config.position).add(toastId);

    // Show with animation
    const frameId = requestAnimationFrame(() => {
      toast.classList.add('show');
      this.animationFrames.delete(frameId);
    });
    this.animationFrames.add(frameId);

    // Auto close
    if (config.duration > 0) {
      const timeoutId = setTimeout(() => {
        this.closeToast(toastId, config.position);
        this.timeouts.delete(timeoutId);
      }, config.duration);
      this.timeouts.add(timeoutId);
    }

    return toastId;
  }

  // Memory-safe toast closing
  closeToast(toastId, position) {
    const toast = document.getElementById(toastId);
    if (!toast) return false;

    toast.classList.remove('show');

    const timeoutId = setTimeout(() => {
      this.cleanupElement(toast);
      
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      // Remove from tracking
      if (this.activeToasts.has(position)) {
        this.activeToasts.get(position).delete(toastId);
        
        // Clean up empty containers
        if (this.activeToasts.get(position).size === 0) {
          const container = document.querySelector(`.smoothalert-toast-container.${position}`);
          if (container && container.children.length === 0) {
            container.parentNode.removeChild(container);
          }
        }
      }

      this.timeouts.delete(timeoutId);
    }, 400);
    
    this.timeouts.add(timeoutId);

    return true;
  }

  // Public API methods with lazy loading
  async alert(message, options = {}) {
    await this.injectStyles();
    return this.createModal({
      message,
      title: options.title || 'Alert',
      type: 'info',
      ...options
    });
  }

  async confirm(message, options = {}) {
    await this.injectStyles();
    return new Promise((resolve) => {
      const modalId = this.createModal({
        message,
        title: options.title || 'Confirm',
        type: 'warning',
        buttons: [
          {
            label: options.confirmText || 'Yes',
            style: 'primary',
            action: () => {
              this.closeModal(modalId);
              resolve(true);
            }
          },
          {
            label: options.cancelText || 'No',
            style: 'secondary',
            action: () => {
              this.closeModal(modalId);
              resolve(false);
            }
          }
        ],
        ...options
      });
    });
  }

  async success(message, options = {}) {
    await this.injectStyles();
    return this.createModal({
      message,
      title: options.title || 'Success',
      type: 'success',
      ...options
    });
  }

  async error(message, options = {}) {
    await this.injectStyles();
    return this.createModal({
      message,
      title: options.title || 'Error',
      type: 'error',
      ...options
    });
  }

  async warning(message, options = {}) {
    await this.injectStyles();
    return this.createModal({
      message,
      title: options.title || 'Warning',
      type: 'warning',
      ...options
    });
  }

  async toast(message, options = {}) {
    await this.injectStyles();
    return this.createToast(message, options);
  }

  // Comprehensive cleanup method
  closeAll() {
    // Close all modals
    this.activeModals.forEach(modalId => {
      this.closeModal(modalId);
    });

    // Close all toasts
    this.activeToasts.forEach((toasts, position) => {
      toasts.forEach(toastId => {
        this.closeToast(toastId, position);
      });
    });
  }

  // Performance and memory management
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      activeModals: this.activeModals.size,
      activeToasts: Array.from(this.activeToasts.values()).reduce(
        (total, toasts) => total + toasts.size, 0
      ),
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0
    };
  }

  // Complete cleanup for memory leak prevention
  cleanup() {
    // Close all active instances
    this.closeAll();

    // Clear all timeouts and intervals
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.intervals.forEach(intervalId => clearInterval(intervalId));
    this.animationFrames.forEach(frameId => cancelAnimationFrame(frameId));

    // Clear collections
    this.timeouts.clear();
    this.intervals.clear();
    this.animationFrames.clear();
    this.activeModals.clear();
    this.activeToasts.clear();

    // Clean up event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler);
      });
    });

    // Reset state
    this.stylesInjected = false;
    this.stylePromise = null;
  }

  setTheme(theme) {
    this.config.theme = theme;
    // Theme switching implementation would go here
  }
}

// Initialize and expose global API
document.addEventListener('DOMContentLoaded', () => {
  const smoothAlertEngine = new SmoothAlertEngine();

  // Global API
  window.smoothAlert = (options) => smoothAlertEngine.createModal(options);
  window.closeSmoothAlert = (modalId) => smoothAlertEngine.closeModal(modalId);
  
  // Enhanced API
  window.SmoothAlert = {
    // New unified show method for the HTML demo
    show: (options) => {
      if (typeof options === 'string') {
        return smoothAlertEngine.alert(options);
      }
      const { type = 'info', title, message, confirmText, onConfirm, customClass, autoClose } = options;
      
      return smoothAlertEngine.createModal({
        message,
        title: title || 'Alert',
        type,
        buttons: [{
          label: confirmText || 'OK',
          style: 'primary',
          action: () => {
            if (onConfirm) onConfirm();
          }
        }],
        customClass,
        autoClose: autoClose ? { duration: autoClose } : false
      });
    },
    
    // Enhanced confirm method for the HTML demo
    confirm: (options) => {
      if (typeof options === 'string') {
        return smoothAlertEngine.confirm(options);
      }
      
      const { title, message, confirmText, cancelText, onConfirm, onCancel } = options;
      
      return new Promise((resolve) => {
        const modalId = smoothAlertEngine.createModal({
          message,
          title: title || 'Confirm',
          type: 'warning',
          buttons: [
            {
              label: confirmText || 'Yes',
              style: 'primary',
              action: () => {
                smoothAlertEngine.closeModal(modalId);
                if (onConfirm) onConfirm();
                resolve(true);
              }
            },
            {
              label: cancelText || 'No',
              style: 'secondary',
              action: () => {
                smoothAlertEngine.closeModal(modalId);
                if (onCancel) onCancel();
                resolve(false);
              }
            }
          ]
        });
      });
    },
    
    // Enhanced toast method for the HTML demo
    toast: (options) => {
      if (typeof options === 'string') {
        return smoothAlertEngine.toast(options);
      }
      
      const { type, message, duration, position } = options;
      return smoothAlertEngine.createToast(message, {
        type: type || 'info',
        duration: duration || 3000,
        position: position || 'top-right'
      });
    },
    
    // Original API methods
    alert: (message, options) => smoothAlertEngine.alert(message, options),
    success: (message, options) => smoothAlertEngine.success(message, options),
    error: (message, options) => smoothAlertEngine.error(message, options),
    warning: (message, options) => smoothAlertEngine.warning(message, options),
    closeAll: () => smoothAlertEngine.closeAll(),
    setTheme: (theme) => smoothAlertEngine.setTheme(theme)
  };

  // Override native alert
  window.alert = (message) => smoothAlertEngine.alert(message);
  
  // Enhanced toast function
  window.toast = (message, options) => smoothAlertEngine.toast(message, options);
});

// Export for Node.js/CommonJS (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmoothAlertEngine;
}

// Export for ES modules
if (typeof exports !== 'undefined') {
  exports.SmoothAlertEngine = SmoothAlertEngine;
  exports.default = SmoothAlertEngine;
}
