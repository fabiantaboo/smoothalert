/**
 * Jest setup file for SmoothAlert Pro tests
 */

// Mock performance.memory for browsers that don't support it
if (!window.performance.memory) {
  window.performance.memory = {
    usedJSHeapSize: 50000000,
    totalJSHeapSize: 100000000,
    jsHeapSizeLimit: 200000000
  };
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 120,
  height: 120,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}));

// Clear DOM after each test
afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

// Global test utilities
global.TestUtils = {
  // Wait for next tick
  nextTick: () => new Promise(resolve => setTimeout(resolve, 0)),
  
  // Wait for animation frames
  waitForAnimationFrame: () => new Promise(resolve => requestAnimationFrame(resolve)),
  
  // Wait for multiple animation frames
  waitForAnimationFrames: (count = 2) => {
    let promise = Promise.resolve();
    for (let i = 0; i < count; i++) {
      promise = promise.then(() => new Promise(resolve => requestAnimationFrame(resolve)));
    }
    return promise;
  },
  
  // Check if element is visible
  isVisible: (element) => {
    return element && element.offsetParent !== null;
  },
  
  // Get computed style
  getComputedStyle: (element, property) => {
    return window.getComputedStyle(element)[property];
  }
}; 