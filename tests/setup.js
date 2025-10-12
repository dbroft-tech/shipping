// Test setup file
import { vi } from 'vitest';

// Mock DOM APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock navigator
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn().mockResolvedValue({
      waiting: null,
      installing: null,
      active: {
        postMessage: vi.fn(),
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    ready: Promise.resolve({
      waiting: null,
      installing: null,
      active: {
        postMessage: vi.fn(),
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  },
  writable: true,
});

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
  writable: true,
});

// Setup DOM
document.body.innerHTML = '';

// Global test utilities
global.createMockElement = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

global.createMockForm = (fields = {}) => {
  const form = document.createElement('form');
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  return form;
};

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});
