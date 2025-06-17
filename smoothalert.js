/**
 * SmoothAlert Pro v2.0 - Ultra Professional Alert & Notification Library
 * Modern, Lightweight, Performance-Optimized
 * Features: Glassmorphism, Dark Mode, Advanced Animations, Confetti Effects, Prompt Alerts
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
    this.confettiParticles = [];
    
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
      enablePerformanceMonitoring: true,
      confettiEnabled: true
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
            display: flex;
            flex-direction: column;
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

          .smoothalert-modal-content {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: calc(90vh - 64px); /* Account for padding */
            margin: -32px;
            padding: 32px;
          }

          .smoothalert-modal-content::-webkit-scrollbar {
            width: 8px;
          }

          .smoothalert-modal-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            margin: 8px 0;
          }

          .smoothalert-modal-content::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, var(--sa-primary), var(--sa-success));
            border-radius: 4px;
            transition: all 0.3s ease;
          }

          .smoothalert-modal-content::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #5856eb, #0ea575);
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
          }

          /* Firefox Scrollbar for modal content */
          .smoothalert-modal-content {
            scrollbar-width: thin;
            scrollbar-color: var(--sa-primary) rgba(255, 255, 255, 0.1);
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
            z-index: 10;
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

          /* Confetti Styles */
          .smoothalert-confetti {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000001;
            overflow: hidden;
          }

          .confetti-piece {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #ff6b6b;
            animation: confetti-fall 3s linear forwards;
          }

          .confetti-piece:nth-child(2n) { background: #4ecdc4; }
          .confetti-piece:nth-child(3n) { background: #45b7d1; }
          .confetti-piece:nth-child(4n) { background: #f9ca24; }
          .confetti-piece:nth-child(5n) { background: #6c5ce7; }
          .confetti-piece:nth-child(6n) { background: #a0e7e5; }

          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }

          /* Prompt Input Styles */
          .smoothalert-input {
            width: 100%;
            padding: 12px 16px;
            margin: 16px 0 24px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            color: white;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
          }

          .smoothalert-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }

          .smoothalert-input:focus {
            border-color: var(--sa-primary);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          }

          .smoothalert-textarea {
            resize: vertical;
            min-height: 80px;
            font-family: inherit;
          }

          /* Comprehensive Form Styles */
          .smoothalert-form {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
          }

          .form-group {
            margin-bottom: 24px;
            position: relative;
          }

          .form-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .form-label.required::after {
            content: '*';
            color: #ff6b6b;
            margin-left: 4px;
          }

          .form-input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            color: white;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .form-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          .form-input:focus {
            border-color: var(--sa-primary);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            transform: translateY(-1px);
          }

          .form-input:invalid {
            border-color: var(--sa-error);
          }

          .form-input:valid {
            border-color: var(--sa-success);
          }

          /* Select Dropdown */
          .form-select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 12px center;
            background-repeat: no-repeat;
            background-size: 16px;
            padding-right: 48px;
          }

          /* Checkbox Styles */
          .form-checkbox-group {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            padding: 8px 0;
          }

          .form-checkbox {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.1);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
          }

          .form-checkbox:checked {
            background: var(--sa-primary);
            border-color: var(--sa-primary);
          }

          .form-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
          }

          /* Radio Button Styles */
          .form-radio-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .form-radio-item {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .form-radio-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .form-radio {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
          }

          .form-radio:checked {
            border-color: var(--sa-primary);
          }

          .form-radio:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: var(--sa-primary);
            border-radius: 50%;
          }

          /* File Upload Styles */
          .form-file-upload {
            position: relative;
            display: block;
            cursor: pointer;
          }

          .form-file-input {
            opacity: 0;
            position: absolute;
            z-index: -1;
          }

          .form-file-label {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 20px;
            border: 2px dashed rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
          }

          .form-file-label:hover {
            border-color: var(--sa-primary);
            background: rgba(99, 102, 241, 0.1);
          }

          .form-file-icon {
            font-size: 24px;
            color: var(--sa-primary);
          }

          /* Range Slider */
          .form-range {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.2);
            outline: none;
            appearance: none;
            cursor: pointer;
          }

          .form-range::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--sa-primary);
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          }

          .form-range::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--sa-primary);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          }

          /* Form Grid Layout */
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .form-row.three-cols {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .form-row.four-cols {
            grid-template-columns: 1fr 1fr 1fr 1fr;
          }

          /* Validation Messages */
          .form-error {
            color: var(--sa-error);
            font-size: 12px;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .form-success {
            color: var(--sa-success);
            font-size: 12px;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          /* Form Buttons */
          .form-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .form-button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 100px;
          }

          .form-button-primary {
            background: var(--sa-primary);
            color: white;
          }

          .form-button-primary:hover {
            background: #5856eb;
            transform: translateY(-1px);
          }

          .form-button-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .form-button-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          /* Toggle Switch */
          .form-toggle-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }

          .form-toggle {
            position: relative;
            width: 50px;
            height: 24px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .form-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .form-toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .form-toggle input:checked + .form-toggle-slider {
            transform: translateX(26px);
          }

          .form-toggle input:checked ~ .form-toggle {
            background: var(--sa-primary);
          }

          /* Multi-Step Form */
          .form-steps {
            display: flex;
            justify-content: center;
            margin-bottom: 32px;
          }

          .form-step {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.1);
            margin: 0 4px;
            transition: all 0.3s ease;
          }

          .form-step.active {
            background: var(--sa-primary);
          }

          .form-step.completed {
            background: var(--sa-success);
          }

          .form-step-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
          }

          .form-step.active .form-step-number,
          .form-step.completed .form-step-number {
            background: rgba(255, 255, 255, 0.3);
          }

          /* Mobile Responsiveness */
          @media (max-width: 768px) {
            .form-row {
              grid-template-columns: 1fr;
            }
            
            .form-row.three-cols,
            .form-row.four-cols {
              grid-template-columns: 1fr;
            }
            
            .form-buttons {
              flex-direction: column;
            }
            
            .form-steps {
              flex-wrap: wrap;
            }
          }

          /* Loading Spinner */
          .smoothalert-spinner {
            width: 40px;
            height: 40px;
            margin: 20px auto;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Enhanced Modal Types */
          .smoothalert-modal.celebration {
            background: linear-gradient(135deg, 
              rgba(255, 107, 107, 0.2) 0%, 
              rgba(78, 205, 196, 0.2) 50%, 
              rgba(69, 183, 209, 0.2) 100%);
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: celebration-pulse 2s ease-in-out infinite;
          }

          @keyframes celebration-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }

          .smoothalert-modal.neon {
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ffff;
            box-shadow: 
              0 0 20px #00ffff,
              0 0 40px #00ffff,
              0 0 60px #00ffff;
            animation: neon-glow 2s ease-in-out infinite alternate;
          }

          @keyframes neon-glow {
            from {
              box-shadow: 
                0 0 20px #00ffff,
                0 0 40px #00ffff,
                0 0 60px #00ffff;
            }
            to {
              box-shadow: 
                0 0 30px #00ffff,
                0 0 60px #00ffff,
                0 0 90px #00ffff;
            }
          }

          .smoothalert-modal.rainbow {
            background: linear-gradient(45deg, 
              rgba(255, 0, 150, 0.2),
              rgba(255, 159, 0, 0.2),
              rgba(255, 255, 0, 0.2),
              rgba(0, 255, 0, 0.2),
              rgba(0, 159, 255, 0.2),
              rgba(159, 0, 255, 0.2));
            background-size: 400% 400%;
            animation: rainbow-shift 3s ease infinite;
          }

          @keyframes rainbow-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Progress Bar */
          .smoothalert-progress {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            margin: 16px 0;
            overflow: hidden;
          }

          .smoothalert-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--sa-primary), var(--sa-success));
            border-radius: 3px;
            transition: width 0.3s ease;
            position: relative;
          }

          .smoothalert-progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.3), 
              transparent);
            animation: progress-shine 2s ease-in-out infinite;
          }

          @keyframes progress-shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          /* Image Modal Enhancements */
          .smoothalert-modal.image-modal {
            max-width: 90vw;
            max-height: 90vh;
            padding: 32px;
            background: var(--sa-glass-bg);
            backdrop-filter: blur(var(--sa-blur));
            border: 1px solid var(--sa-glass-border);
            overflow-y: auto;
          }

          .smoothalert-image-large {
            width: 100%;
            max-width: 800px;
            height: auto;
            border-radius: 12px;
            display: block;
            margin: 0 auto 16px auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .smoothalert-image-content {
            padding: 16px 0 0 0;
            text-align: center;
          }

          /* Form Modal Specific Styling */
          .smoothalert-modal.form-modal {
            max-height: 85vh;
            overflow-y: auto;
            padding: 32px;
          }

          .smoothalert-modal.form-modal.large {
            max-width: 700px;
            width: 90vw;
          }

          .smoothalert-modal.form-modal.medium {
            max-width: 500px;
            width: 80vw;
          }

          .smoothalert-modal.form-modal.small {
            max-width: 400px;
            width: 70vw;
          }

          .smoothalert-modal.form-modal.full {
            max-width: 95vw;
            width: 95vw;
            max-height: 95vh;
          }

          /* Enhanced Menu Buttons for Advanced Forms */
          .form-menu-button {
            background: linear-gradient(135deg, var(--sa-glass-bg), rgba(255, 255, 255, 0.15));
            border: 1px solid var(--sa-glass-border);
            border-radius: 12px;
            padding: 20px;
            width: 100%;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: left;
          }

          .form-menu-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.25));
            border-color: rgba(255, 255, 255, 0.3);
          }

          .form-menu-button .icon {
            font-size: 24px;
            min-width: 32px;
          }

          .form-menu-button .content {
            flex: 1;
          }

          .form-menu-button .title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .form-menu-button .description {
            font-size: 13px;
            opacity: 0.8;
            line-height: 1.3;
          }

          /* Sound Wave Animation */
          .smoothalert-sound-wave {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
            margin: 20px 0;
          }

          .sound-bar {
            width: 4px;
            background: var(--sa-primary);
            border-radius: 2px;
            animation: sound-wave 1.5s ease-in-out infinite;
          }

          .sound-bar:nth-child(1) { height: 20px; animation-delay: 0s; }
          .sound-bar:nth-child(2) { height: 30px; animation-delay: 0.1s; }
          .sound-bar:nth-child(3) { height: 25px; animation-delay: 0.2s; }
          .sound-bar:nth-child(4) { height: 35px; animation-delay: 0.3s; }
          .sound-bar:nth-child(5) { height: 20px; animation-delay: 0.4s; }

          @keyframes sound-wave {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.3); }
          }

          /* Shake Animation for Errors */
          .smoothalert-modal.shake {
            animation: shake 0.5s ease-in-out;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }

          /* Bounce Animation for Success */
          .smoothalert-modal.bounce {
            animation: bounce 0.6s ease-in-out;
          }

          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0,-20px,0); }
            70% { transform: translate3d(0,-10px,0); }
            90% { transform: translate3d(0,-4px,0); }
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

    // Create content wrapper for scrolling
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'smoothalert-modal-content';
    contentWrapper.innerHTML = content;
    contentWrapper.appendChild(buttonsContainer);
    
    modal.appendChild(contentWrapper);
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

  // Confetti Effects
  createConfetti(options = {}) {
    if (!this.config.confettiEnabled || this.config.reducedMotion) return;

    const defaults = {
      particleCount: 100,
      duration: 3000,
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a0e7e5']
    };

    const config = { ...defaults, ...options };

    // Create confetti container
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'smoothalert-confetti';
    document.body.appendChild(confettiContainer);

    // Generate particles
    for (let i = 0; i < config.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-piece';
      
      // Random properties
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = Math.random() * 2 + 2;

      particle.style.background = color;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = left + '%';
      particle.style.animationDelay = delay + 's';
      particle.style.animationDuration = duration + 's';

      confettiContainer.appendChild(particle);
      this.confettiParticles.push(particle);
    }

    // Clean up after animation
    const timeoutId = setTimeout(() => {
      if (confettiContainer.parentNode) {
        confettiContainer.parentNode.removeChild(confettiContainer);
      }
      this.confettiParticles = [];
      this.timeouts.delete(timeoutId);
    }, config.duration);

    this.timeouts.add(timeoutId);
  }

  // Prompt Alert
  async prompt(message, options = {}) {
    await this.injectStyles();
    
    const defaults = {
      title: 'Input Required',
      placeholder: 'Enter your text...',
      inputType: 'text',
      defaultValue: '',
      multiline: false,
      required: false
    };

    const config = { ...defaults, ...options };

    return new Promise((resolve) => {
      const inputId = 'smoothalert-input-' + this.generateId();
      const inputElement = config.multiline ? 'textarea' : 'input';
      const inputClass = config.multiline ? 'smoothalert-input smoothalert-textarea' : 'smoothalert-input';
      
      let inputHTML = `<${inputElement} 
        id="${inputId}"
        class="${inputClass}"
        placeholder="${config.placeholder}"
        ${config.inputType ? `type="${config.inputType}"` : ''}
        ${config.required ? 'required' : ''}
      >${config.defaultValue}</${inputElement}>`;

      const modalId = this.createModal({
        title: config.title,
        message: message + inputHTML,
        type: 'info',
        buttons: [
          {
            label: 'OK',
            style: 'primary',
            action: (modalId) => {
              const input = document.getElementById(inputId);
              const value = input ? input.value : '';
              if (config.required && !value.trim()) {
                input.focus();
                return;
              }
              this.closeModal(modalId);
              resolve(value);
            }
          },
          {
            label: 'Cancel',
            style: 'secondary',
            action: (modalId) => {
              this.closeModal(modalId);
              resolve(null);
            }
          }
        ],
        backdropClose: false
      });

      // Focus input after modal is shown
      setTimeout(() => {
        const input = document.getElementById(inputId);
        if (input) input.focus();
      }, 100);
    });
  }

  // Loading Alert
  async loading(message, options = {}) {
    await this.injectStyles();
    
    const defaults = {
      title: 'Loading...',
      showSpinner: true,
      showProgress: false,
      progress: 0
    };

    const config = { ...defaults, ...options };
    
    let content = message || '';
    
    if (config.showSpinner) {
      content += '<div class="smoothalert-spinner"></div>';
    }
    
    if (config.showProgress) {
      content += `
        <div class="smoothalert-progress">
          <div class="smoothalert-progress-bar" style="width: ${config.progress}%"></div>
        </div>
      `;
    }

    const modalId = await this.createModal({
      title: config.title,
      message: content,
      type: 'info',
      buttons: [],
      showCloseButton: false,
      backdropClose: false
    });

    return {
      modalId,
      updateProgress: (progress) => {
        const progressBar = document.querySelector(`#${modalId} .smoothalert-progress-bar`);
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
      },
      close: () => this.closeModal(modalId)
    };
  }

  // Celebration Alert with Confetti
  async celebration(message, options = {}) {
    await this.injectStyles();
    
    const modalId = await this.createModal({
      title: options.title || '🎉 Celebration!',
      message,
      type: 'success',
      className: 'celebration bounce',
      ...options
    });

    // Trigger confetti
    this.createConfetti({
      particleCount: 150,
      duration: 4000
    });

    return modalId;
  }

  // Neon Style Alert
  async neon(message, options = {}) {
    await this.injectStyles();
    
    return this.createModal({
      title: options.title || '⚡ Neon Alert',
      message,
      type: 'info',
      className: 'neon',
      ...options
    });
  }

  // Rainbow Style Alert
  async rainbow(message, options = {}) {
    await this.injectStyles();
    
    return this.createModal({
      title: options.title || '🌈 Rainbow Alert',
      message,
      type: 'info',
      className: 'rainbow',
      ...options
    });
  }

  // Image Viewer Alert
  async imageViewer(imageUrl, options = {}) {
    await this.injectStyles();
    
    const defaults = {
      title: 'Image Viewer',
      description: ''
    };

    const config = { ...defaults, ...options };
    
    let content = `<img src="${imageUrl}" alt="Image" class="smoothalert-image-large">`;
    
    if (config.description) {
      content += `<div class="smoothalert-image-content">
        <p class="smoothalert-message">${config.description}</p>
      </div>`;
    }

    return this.createModal({
      title: config.title,
      message: content,
      type: 'info',
      className: 'image-modal',
      buttons: [{ label: 'Close', style: 'primary', action: 'close' }],
      showCloseButton: true,
      ...options
    });
  }

  // Sound Wave Alert (for audio notifications)
  async soundWave(message, options = {}) {
    await this.injectStyles();
    
    const soundWaveHTML = `
      <div class="smoothalert-sound-wave">
        <div class="sound-bar"></div>
        <div class="sound-bar"></div>
        <div class="sound-bar"></div>
        <div class="sound-bar"></div>
        <div class="sound-bar"></div>
      </div>
    `;

    return this.createModal({
      title: options.title || '🔊 Audio Alert',
      message: message + soundWaveHTML,
      type: 'info',
      ...options
    });
  }

  // Enhanced Error with Shake
  async errorShake(message, options = {}) {
    await this.injectStyles();
    
    return this.createModal({
      title: options.title || 'Error!',
      message,
      type: 'error',
      className: 'shake',
      ...options
    });
  }

  // Comprehensive Form Builder
  async form(formConfig, options = {}) {
    await this.injectStyles();
    
    const defaults = {
      title: 'Form',
      submitText: 'Submit',
      cancelText: 'Cancel',
      showSteps: false,
      validation: true,
      width: 'large' // small, medium, large, full
    };

    const config = { ...defaults, ...options };
    
    return new Promise((resolve) => {
      const formId = 'smoothalert-form-' + this.generateId();
      const formData = {};
      const errors = {};
      
      // Generate form HTML
      const formHTML = this.generateFormHTML(formConfig, formId, config);
      
      const modalClass = `form-modal ${config.width}`;
      
      const modalId = this.createModal({
        title: config.title,
        message: formHTML,
        type: 'info',
        className: modalClass,
        showCloseButton: false,
        backdropClose: false,
        buttons: [
          {
            label: config.submitText,
            style: 'primary',
            action: (modalId) => {
              if (this.validateForm(formConfig, formId, config.validation)) {
                const data = this.collectFormData(formConfig, formId);
                this.closeModal(modalId);
                resolve({ success: true, data });
              }
            }
          },
          {
            label: config.cancelText,
            style: 'secondary',
            action: (modalId) => {
              this.closeModal(modalId);
              resolve({ success: false, data: null });
            }
          }
        ]
      });

      // Initialize form after modal is created
      setTimeout(() => {
        this.initializeFormElements(formConfig, formId, config);
      }, 100);
    });
  }

  // Generate Form HTML
  generateFormHTML(formConfig, formId, config) {
    let html = `<div class="smoothalert-form" id="${formId}">`;
    
    // Add steps if multi-step
    if (config.showSteps && formConfig.steps) {
      html += this.generateStepsHTML(formConfig.steps);
    }
    
    // Generate form fields
    if (formConfig.fields) {
      html += this.generateFieldsHTML(formConfig.fields);
    } else if (formConfig.steps) {
      // Multi-step form
      formConfig.steps.forEach((step, index) => {
        const stepClass = index === 0 ? 'form-step-content active' : 'form-step-content';
        html += `<div class="${stepClass}" data-step="${index}">`;
        html += this.generateFieldsHTML(step.fields);
        html += '</div>';
      });
    }
    
    html += '</div>';
    return html;
  }

  // Generate Steps HTML
  generateStepsHTML(steps) {
    let html = '<div class="form-steps">';
    steps.forEach((step, index) => {
      const stepClass = index === 0 ? 'form-step active' : 'form-step';
      html += `
        <div class="${stepClass}" data-step="${index}">
          <div class="form-step-number">${index + 1}</div>
          <span>${step.title}</span>
        </div>
      `;
    });
    html += '</div>';
    return html;
  }

  // Generate Fields HTML
  generateFieldsHTML(fields) {
    let html = '';
    
    fields.forEach(field => {
      html += this.generateFieldHTML(field);
    });
    
    return html;
  }

  // Generate Individual Field HTML
  generateFieldHTML(field) {
    const fieldId = `field-${this.generateId()}`;
    const required = field.required ? 'required' : '';
    const requiredClass = field.required ? 'required' : '';
    
    let html = '';
    
    // Handle form rows
    if (field.type === 'row') {
      const colClass = field.columns ? `form-row ${field.columns}-cols` : 'form-row';
      html += `<div class="${colClass}">`;
      field.fields.forEach(subField => {
        html += this.generateFieldHTML(subField);
      });
      html += '</div>';
      return html;
    }
    
    html += `<div class="form-group">`;
    
    // Label
    if (field.label) {
      html += `<label class="form-label ${requiredClass}" for="${fieldId}">${field.label}</label>`;
    }
    
    // Field based on type
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        html += `<input 
          type="${field.type}" 
          id="${fieldId}" 
          name="${field.name}" 
          class="form-input" 
          placeholder="${field.placeholder || ''}" 
          ${required}
          ${field.min ? `min="${field.min}"` : ''}
          ${field.max ? `max="${field.max}"` : ''}
          ${field.pattern ? `pattern="${field.pattern}"` : ''}
          value="${field.defaultValue || ''}"
        >`;
        break;
        
      case 'textarea':
        html += `<textarea 
          id="${fieldId}" 
          name="${field.name}" 
          class="form-input smoothalert-textarea" 
          placeholder="${field.placeholder || ''}" 
          rows="${field.rows || 4}"
          ${required}
        >${field.defaultValue || ''}</textarea>`;
        break;
        
      case 'select':
        html += `<select id="${fieldId}" name="${field.name}" class="form-input form-select" ${required}>`;
        if (field.placeholder) {
          html += `<option value="">${field.placeholder}</option>`;
        }
        field.options.forEach(option => {
          const selected = option.value === field.defaultValue ? 'selected' : '';
          html += `<option value="${option.value}" ${selected}>${option.label}</option>`;
        });
        html += '</select>';
        break;
        
      case 'checkbox':
        if (field.options) {
          // Multiple checkboxes with same name
          html += '<div class="form-checkbox-group-container">';
          field.options.forEach(option => {
            const optionId = `${fieldId}-${option.value}`;
            const checked = field.defaultValue && field.defaultValue.includes(option.value) ? 'checked' : '';
            html += `<label class="form-checkbox-group">
              <input type="checkbox" id="${optionId}" name="${field.name}" class="form-checkbox" value="${option.value}" ${checked}>
              <span>${option.label}</span>
            </label>`;
          });
          html += '</div>';
        } else {
          // Single checkbox
          html += `<label class="form-checkbox-group">
            <input type="checkbox" id="${fieldId}" name="${field.name}" class="form-checkbox" value="${field.value || '1'}" ${field.checked ? 'checked' : ''}>
            <span>${field.text || field.label}</span>
          </label>`;
        }
        break;
        
      case 'radio':
        html += '<div class="form-radio-group">';
        field.options.forEach(option => {
          const optionId = `${fieldId}-${option.value}`;
          const checked = option.value === field.defaultValue ? 'checked' : '';
          html += `<label class="form-radio-item">
            <input type="radio" id="${optionId}" name="${field.name}" class="form-radio" value="${option.value}" ${checked}>
            <span>${option.label}</span>
          </label>`;
        });
        html += '</div>';
        break;
        
      case 'file':
        html += `<label class="form-file-upload">
          <input type="file" id="${fieldId}" name="${field.name}" class="form-file-input" ${field.multiple ? 'multiple' : ''} ${field.accept ? `accept="${field.accept}"` : ''}>
          <div class="form-file-label">
            <i class="fas fa-cloud-upload-alt form-file-icon"></i>
            <span>${field.placeholder || 'Choose files...'}</span>
          </div>
        </label>`;
        break;
        
      case 'range':
        html += `<input 
          type="range" 
          id="${fieldId}" 
          name="${field.name}" 
          class="form-range" 
          min="${field.min || 0}" 
          max="${field.max || 100}" 
          value="${field.defaultValue || field.min || 0}"
          step="${field.step || 1}"
        >
        <div class="range-value" id="${fieldId}-value">${field.defaultValue || field.min || 0}</div>`;
        break;
        
      case 'toggle':
        html += `<div class="form-toggle-group">
          <span>${field.text || field.label}</span>
          <label class="form-toggle">
            <input type="checkbox" id="${fieldId}" name="${field.name}" ${field.checked ? 'checked' : ''}>
            <span class="form-toggle-slider"></span>
          </label>
        </div>`;
        break;
        
      case 'date':
      case 'time':
      case 'datetime-local':
        html += `<input 
          type="${field.type}" 
          id="${fieldId}" 
          name="${field.name}" 
          class="form-input" 
          ${required}
          value="${field.defaultValue || ''}"
        >`;
        break;
    }

    // Validation message placeholder
    html += `<div class="form-validation" id="${fieldId}-validation"></div>`;
    
    html += '</div>';
    return html;
  }

  // Initialize Form Elements
  initializeFormElements(formConfig, formId, config) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Initialize range sliders
    form.querySelectorAll('.form-range').forEach(range => {
      const valueDisplay = document.getElementById(range.id + '-value');
      if (valueDisplay) {
        range.addEventListener('input', (e) => {
          valueDisplay.textContent = e.target.value;
        });
      }
    });
    
    // Initialize file uploads
    form.querySelectorAll('.form-file-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const label = e.target.nextElementSibling.querySelector('span');
        const files = e.target.files;
        if (files.length > 0) {
          const fileText = files.length === 1 ? files[0].name : `${files.length} files selected`;
          label.textContent = fileText;
        }
      });
    });
    
    // Real-time validation
    if (config.validation) {
      form.querySelectorAll('.form-input, .form-checkbox, .form-radio').forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          this.clearFieldValidation(input);
        });
      });
    }
  }

  // Validate Form
  validateForm(formConfig, formId, enableValidation) {
    if (!enableValidation) return true;
    
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const fields = this.getAllFields(formConfig);
    
    fields.forEach(field => {
      const element = form.querySelector(`[name="${field.name}"]`);
      if (element && !this.validateField(element, field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  // Validate Individual Field
  validateField(element, fieldConfig = null) {
    const validationContainer = document.getElementById(element.id + '-validation');
    if (!validationContainer) return true;
    
    // Clear previous validation
    validationContainer.innerHTML = '';
    element.classList.remove('error', 'success');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (element.hasAttribute('required') && !element.value.trim()) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Type-specific validation
    if (isValid && element.value) {
      switch (element.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(element.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
          break;
          
        case 'url':
          try {
            new URL(element.value);
          } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
          }
          break;
          
        case 'number':
          if (element.hasAttribute('min') && parseFloat(element.value) < parseFloat(element.min)) {
            isValid = false;
            errorMessage = `Value must be at least ${element.min}`;
          }
          if (element.hasAttribute('max') && parseFloat(element.value) > parseFloat(element.max)) {
            isValid = false;
            errorMessage = `Value must be at most ${element.max}`;
          }
          break;
      }
      
      // Pattern validation
      if (isValid && element.hasAttribute('pattern')) {
        const regex = new RegExp(element.pattern);
        if (!regex.test(element.value)) {
          isValid = false;
          errorMessage = 'Please match the required format';
        }
      }
    }
    
    // Display validation result
    if (!isValid) {
      element.classList.add('error');
      validationContainer.innerHTML = `<div class="form-error"><i class="fas fa-exclamation-circle"></i> ${errorMessage}</div>`;
    } else if (element.value) {
      element.classList.add('success');
      validationContainer.innerHTML = `<div class="form-success"><i class="fas fa-check-circle"></i> Valid</div>`;
    }
    
    return isValid;
  }

  // Clear Field Validation
  clearFieldValidation(element) {
    const validationContainer = document.getElementById(element.id + '-validation');
    if (validationContainer) {
      validationContainer.innerHTML = '';
    }
    element.classList.remove('error', 'success');
  }

  // Collect Form Data
  collectFormData(formConfig, formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    const data = {};
    const fields = this.getAllFields(formConfig);
    
    fields.forEach(field => {
      const elements = form.querySelectorAll(`[name="${field.name}"]`);
      
      if (elements.length === 0) return;
      
      switch (field.type) {
        case 'checkbox':
          if (elements.length === 1) {
            data[field.name] = elements[0].checked;
          } else {
            data[field.name] = Array.from(elements).filter(el => el.checked).map(el => el.value);
          }
          break;
          
        case 'radio':
          const checked = Array.from(elements).find(el => el.checked);
          data[field.name] = checked ? checked.value : null;
          break;
          
        case 'file':
          data[field.name] = elements[0].files;
          break;
          
        case 'range':
        case 'number':
          data[field.name] = parseFloat(elements[0].value);
          break;
          
        case 'toggle':
          data[field.name] = elements[0].checked;
          break;
          
        default:
          data[field.name] = elements[0].value;
      }
    });
    
    return data;
  }

  // Get All Fields (flattened)
  getAllFields(formConfig) {
    let fields = [];
    
    if (formConfig.fields) {
      fields = this.flattenFields(formConfig.fields);
    } else if (formConfig.steps) {
      formConfig.steps.forEach(step => {
        fields = fields.concat(this.flattenFields(step.fields));
      });
    }
    
    return fields;
  }

  // Flatten Fields (handle rows)
  flattenFields(fields) {
    let flattened = [];
    
    fields.forEach(field => {
      if (field.type === 'row') {
        flattened = flattened.concat(this.flattenFields(field.fields));
      } else {
        flattened.push(field);
      }
    });
    
    return flattened;
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
    show: async (options) => {
      if (typeof options === 'string') {
        return smoothAlertEngine.alert(options);
      }
      const { type = 'info', title, message, confirmText, onConfirm, customClass, autoClose } = options;
      
      const modalId = await smoothAlertEngine.createModal({
        message,
        title: title || 'Alert',
        type,
        buttons: [{
          label: confirmText || 'OK',
          style: 'primary',
          action: (modalId) => {
            if (onConfirm) onConfirm();
            smoothAlertEngine.closeModal(modalId);
          }
        }],
        customClass,
        autoClose: autoClose ? { duration: autoClose } : false
      });
      
      return modalId;
    },
    
    // Enhanced confirm method for the HTML demo
    confirm: async (options) => {
      if (typeof options === 'string') {
        return smoothAlertEngine.confirm(options);
      }
      
      const { title, message, confirmText, cancelText, onConfirm, onCancel } = options;
      
      return new Promise(async (resolve) => {
        const modalId = await smoothAlertEngine.createModal({
          message,
          title: title || 'Confirm',
          type: 'warning',
          buttons: [
            {
              label: confirmText || 'Yes',
              style: 'primary',
              action: (modalId) => {
                if (onConfirm) onConfirm();
                smoothAlertEngine.closeModal(modalId);
                resolve(true);
              }
            },
            {
              label: cancelText || 'No',
              style: 'secondary',
              action: (modalId) => {
                if (onCancel) onCancel();
                smoothAlertEngine.closeModal(modalId);
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
    setTheme: (theme) => smoothAlertEngine.setTheme(theme),
    
    // New awesome features! 🎉
    prompt: (message, options) => smoothAlertEngine.prompt(message, options),
    loading: (message, options) => smoothAlertEngine.loading(message, options),
    celebration: (message, options) => smoothAlertEngine.celebration(message, options),
    confetti: (options) => smoothAlertEngine.createConfetti(options),
    neon: (message, options) => smoothAlertEngine.neon(message, options),
    rainbow: (message, options) => smoothAlertEngine.rainbow(message, options),
    imageViewer: (imageUrl, options) => smoothAlertEngine.imageViewer(imageUrl, options),
    soundWave: (message, options) => smoothAlertEngine.soundWave(message, options),
    errorShake: (message, options) => smoothAlertEngine.errorShake(message, options),
    form: (formConfig, options) => smoothAlertEngine.form(formConfig, options)
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
