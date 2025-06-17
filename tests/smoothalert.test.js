/**
 * SmoothAlert Pro Unit Tests
 * Testing core functionality, memory management, and performance
 */

// Import the engine - adjust path as needed
const SmoothAlertEngine = require('../src/smoothalert.js');

describe('SmoothAlert Pro Engine', () => {
  let engine;

  beforeEach(() => {
    engine = new SmoothAlertEngine();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any created instances
    if (engine) {
      engine.cleanup();
    }
  });

  describe('Initialization', () => {
    test('should initialize with default config', () => {
      expect(engine.config).toBeDefined();
      expect(engine.config.theme).toBe('modern');
      expect(engine.config.lazyStyleInjection).toBe(true);
      expect(engine.config.enablePerformanceMonitoring).toBe(true);
    });

    test('should initialize WeakMaps for memory management', () => {
      expect(engine.elementMetadata).toBeInstanceOf(WeakMap);
      expect(engine.eventListeners).toBeInstanceOf(WeakMap);
    });

    test('should initialize performance metrics', () => {
      expect(engine.performanceMetrics).toBeDefined();
      expect(engine.performanceMetrics.renderTime).toBe(0);
      expect(engine.performanceMetrics.totalModalsCreated).toBe(0);
    });

    test('should detect mobile device', () => {
      expect(typeof engine.isMobile).toBe('boolean');
    });
  });

  describe('Lazy Style Injection', () => {
    test('should not inject styles immediately with lazy loading enabled', () => {
      expect(engine.stylesInjected).toBe(false);
      expect(document.getElementById('smoothalert-pro-styles')).toBeNull();
    });

    test('should inject styles when needed', async () => {
      await engine.injectStyles();
      expect(engine.stylesInjected).toBe(true);
      expect(document.getElementById('smoothalert-pro-styles')).not.toBeNull();
    });

    test('should not inject styles multiple times', async () => {
      await engine.injectStyles();
      await engine.injectStyles();
      const styleElements = document.querySelectorAll('#smoothalert-pro-styles');
      expect(styleElements.length).toBe(1);
    });

    test('should return same promise for concurrent injection requests', async () => {
      const promise1 = engine.injectStyles();
      const promise2 = engine.injectStyles();
      expect(promise1).toBe(promise2);
    });
  });

  describe('Modal Creation', () => {
    test('should create basic modal', async () => {
      const modalId = await engine.alert('Test message');
      
      expect(modalId).toBeDefined();
      expect(engine.activeModals.has(modalId)).toBe(true);
      expect(document.getElementById(modalId)).not.toBeNull();
    });

    test('should create modal with custom options', async () => {
      const modalId = await engine.createModal({
        title: 'Test Title',
        message: 'Test Message',
        type: 'success',
        imageUrl: 'https://example.com/image.jpg'
      });

      const modal = document.getElementById(modalId);
      expect(modal.querySelector('.smoothalert-title')).not.toBeNull();
      expect(modal.querySelector('.smoothalert-message')).not.toBeNull();
      expect(modal.querySelector('.smoothalert-image')).not.toBeNull();
    });

    test('should prevent duplicate modals with same ID', async () => {
      const customId = 'test-modal-id';
      const modalId1 = await engine.createModal({ id: customId, message: 'Test' });
      const modalId2 = await engine.createModal({ id: customId, message: 'Test 2' });
      
      expect(modalId1).toBe(modalId2);
      expect(engine.activeModals.size).toBe(1);
    });

    test('should store element metadata', async () => {
      const modalId = await engine.createModal({ message: 'Test' });
      const overlay = document.getElementById(`overlay-${modalId}`);
      const modal = document.getElementById(modalId);
      
      expect(engine.elementMetadata.has(overlay)).toBe(true);
      expect(engine.elementMetadata.has(modal)).toBe(true);
    });

    test('should increment performance metrics', async () => {
      const initialCount = engine.performanceMetrics.totalModalsCreated;
      await engine.createModal({ message: 'Test' });
      expect(engine.performanceMetrics.totalModalsCreated).toBe(initialCount + 1);
    });
  });

  describe('Modal Closing', () => {
    test('should close modal and clean up', async () => {
      const modalId = await engine.createModal({ message: 'Test' });
      const overlay = document.getElementById(`overlay-${modalId}`);
      const modal = document.getElementById(modalId);
      
      const closed = engine.closeModal(modalId);
      expect(closed).toBe(true);
      expect(engine.activeModals.has(modalId)).toBe(false);
      
      // Wait for cleanup
      await TestUtils.nextTick();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      expect(document.getElementById(`overlay-${modalId}`)).toBeNull();
    });

    test('should return false for non-existent modal', () => {
      const closed = engine.closeModal('non-existent-id');
      expect(closed).toBe(false);
    });

    test('should clean up element metadata', async () => {
      const modalId = await engine.createModal({ message: 'Test' });
      const overlay = document.getElementById(`overlay-${modalId}`);
      
      engine.closeModal(modalId);
      
      // Element metadata should be cleaned up
      expect(engine.elementMetadata.has(overlay)).toBe(false);
    });
  });

  describe('Toast Creation', () => {
    test('should create basic toast', async () => {
      const toastId = await engine.toast('Test toast');
      
      expect(toastId).toBeDefined();
      expect(document.getElementById(toastId)).not.toBeNull();
    });

    test('should create toast container for position', async () => {
      await engine.toast('Test toast', { position: 'bottom-left' });
      
      const container = document.querySelector('.smoothalert-toast-container.bottom-left');
      expect(container).not.toBeNull();
    });

    test('should track active toasts by position', async () => {
      const toastId = await engine.toast('Test toast', { position: 'top-right' });
      
      expect(engine.activeToasts.has('top-right')).toBe(true);
      expect(engine.activeToasts.get('top-right').has(toastId)).toBe(true);
    });

    test('should add progress bar when enabled', async () => {
      const toastId = await engine.toast('Test toast', { showProgress: true });
      const toast = document.getElementById(toastId);
      
      expect(toast.querySelector('.smoothalert-toast-progress')).not.toBeNull();
    });
  });

  describe('Toast Closing', () => {
    test('should close toast and clean up', async () => {
      const toastId = await engine.toast('Test toast', { position: 'top-right' });
      
      const closed = engine.closeToast(toastId, 'top-right');
      expect(closed).toBe(true);
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 500));
      expect(document.getElementById(toastId)).toBeNull();
    });

    test('should remove toast from tracking', async () => {
      const toastId = await engine.toast('Test toast', { position: 'top-right' });
      
      engine.closeToast(toastId, 'top-right');
      
      expect(engine.activeToasts.get('top-right').has(toastId)).toBe(false);
    });

    test('should clean up empty containers', async () => {
      const toastId = await engine.toast('Test toast', { position: 'bottom-center' });
      
      engine.closeToast(toastId, 'bottom-center');
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const container = document.querySelector('.smoothalert-toast-container.bottom-center');
      expect(container).toBeNull();
    });
  });

  describe('Confirmation Dialogs', () => {
    test('should resolve true when confirmed', async () => {
      const confirmPromise = engine.confirm('Are you sure?');
      
      // Wait for modal to be created
      await TestUtils.waitForAnimationFrame();
      
      // Find and click the confirm button
      const confirmButton = document.querySelector('.smoothalert-button.primary');
      confirmButton.click();
      
      const result = await confirmPromise;
      expect(result).toBe(true);
    });

    test('should resolve false when cancelled', async () => {
      const confirmPromise = engine.confirm('Are you sure?');
      
      // Wait for modal to be created
      await TestUtils.waitForAnimationFrame();
      
      // Find and click the cancel button
      const cancelButton = document.querySelector('.smoothalert-button.secondary');
      cancelButton.click();
      
      const result = await confirmPromise;
      expect(result).toBe(false);
    });
  });

  describe('Memory Management', () => {
    test('should track timeouts and intervals', async () => {
      const initialTimeouts = engine.timeouts.size;
      const initialIntervals = engine.intervals.size;
      
      await engine.createToast('Test toast', { duration: 5000 });
      
      expect(engine.timeouts.size).toBeGreaterThan(initialTimeouts);
    });

    test('should clean up all resources on cleanup', async () => {
      // Create some modals and toasts
      await engine.createModal({ message: 'Test modal' });
      await engine.createToast('Test toast');
      
      // Add some timeouts
      const timeoutId = setTimeout(() => {}, 1000);
      engine.timeouts.add(timeoutId);
      
      engine.cleanup();
      
      expect(engine.activeModals.size).toBe(0);
      expect(engine.activeToasts.size).toBe(0);
      expect(engine.timeouts.size).toBe(0);
      expect(engine.stylesInjected).toBe(false);
    });

    test('should prevent memory leaks with WeakMap', async () => {
      const modalId = await engine.createModal({ message: 'Test' });
      const overlay = document.getElementById(`overlay-${modalId}`);
      
      // Verify metadata is stored
      expect(engine.elementMetadata.has(overlay)).toBe(true);
      
      // Close modal
      engine.closeModal(modalId);
      
      // Metadata should be cleaned up
      expect(engine.elementMetadata.has(overlay)).toBe(false);
    });
  });

  describe('Performance Monitoring', () => {
    test('should track render time', async () => {
      const initialRenderTime = engine.performanceMetrics.renderTime;
      await engine.createModal({ message: 'Test' });
      
      expect(engine.performanceMetrics.renderTime).toBeGreaterThanOrEqual(initialRenderTime);
    });

    test('should provide performance metrics', () => {
      const metrics = engine.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('renderTime');
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('activeModals');
      expect(metrics).toHaveProperty('totalModalsCreated');
    });

    test('should track active modal count', async () => {
      const initialCount = engine.getPerformanceMetrics().activeModals;
      
      await engine.createModal({ message: 'Test 1' });
      await engine.createModal({ message: 'Test 2' });
      
      const currentCount = engine.getPerformanceMetrics().activeModals;
      expect(currentCount).toBe(initialCount + 2);
    });
  });

  describe('Event Handling', () => {
    test('should handle escape key to close modals', async () => {
      const modalId = await engine.createModal({ message: 'Test' });
      
      // Simulate escape key press
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      
      expect(engine.activeModals.has(modalId)).toBe(false);
    });

    test('should pause animations on page visibility change', () => {
      const spy = jest.spyOn(engine, 'pauseAnimations');
      
      // Mock document.hidden
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: true
      });
      
      // Trigger visibility change
      const visibilityEvent = new Event('visibilitychange');
      document.dispatchEvent(visibilityEvent);
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Theme System', () => {
    test('should set theme', () => {
      engine.setTheme('dark');
      expect(engine.config.theme).toBe('dark');
    });
  });

  describe('API Methods', () => {
    test('should create success modal', async () => {
      const modalId = await engine.success('Success message');
      const modal = document.getElementById(modalId);
      
      expect(modal).not.toBeNull();
      expect(modal.querySelector('.smoothalert-title').textContent).toBe('Success');
    });

    test('should create error modal', async () => {
      const modalId = await engine.error('Error message');
      const modal = document.getElementById(modalId);
      
      expect(modal).not.toBeNull();
      expect(modal.querySelector('.smoothalert-title').textContent).toBe('Error');
    });

    test('should create warning modal', async () => {
      const modalId = await engine.warning('Warning message');
      const modal = document.getElementById(modalId);
      
      expect(modal).not.toBeNull();
      expect(modal.querySelector('.smoothalert-title').textContent).toBe('Warning');
    });

    test('should close all modals and toasts', async () => {
      await engine.createModal({ message: 'Test 1' });
      await engine.createModal({ message: 'Test 2' });
      await engine.createToast('Toast 1');
      await engine.createToast('Toast 2');
      
      engine.closeAll();
      
      expect(engine.activeModals.size).toBe(0);
      expect(Array.from(engine.activeToasts.values()).reduce((total, toasts) => total + toasts.size, 0)).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle multiple rapid modal creations', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(engine.createModal({ message: `Modal ${i}` }));
      }
      
      const modalIds = await Promise.all(promises);
      
      expect(modalIds.length).toBe(10);
      expect(engine.activeModals.size).toBe(10);
    });

    test('should handle cleanup with no active instances', () => {
      expect(() => {
        engine.cleanup();
      }).not.toThrow();
    });

    test('should handle style injection after cleanup', async () => {
      engine.cleanup();
      
      await engine.injectStyles();
      expect(engine.stylesInjected).toBe(true);
    });
  });
}); 