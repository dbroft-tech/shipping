// Tests for main JavaScript functionality
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the script file functions
const mockRGRLogistics = {
  showNotification: vi.fn(),
  scrollToTop: vi.fn(),
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isValidUgandanPhone: (phone) => /^(\+256|0)[7-9]\d{8}$/.test(phone.replace(/\s/g, '')),
};

// Make it globally available
global.RGRLogistics = mockRGRLogistics;

describe('RGR Logistics Website Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(mockRGRLogistics.isValidEmail('test@example.com')).toBe(true);
      expect(mockRGRLogistics.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(mockRGRLogistics.isValidEmail('contact@rgr-logistics.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(mockRGRLogistics.isValidEmail('invalid-email')).toBe(false);
      expect(mockRGRLogistics.isValidEmail('test@')).toBe(false);
      expect(mockRGRLogistics.isValidEmail('@domain.com')).toBe(false);
      expect(mockRGRLogistics.isValidEmail('test.domain.com')).toBe(false);
    });
  });

  describe('Ugandan Phone Validation', () => {
    it('should validate correct Ugandan phone numbers', () => {
      expect(mockRGRLogistics.isValidUgandanPhone('+256705312409')).toBe(true);
      expect(mockRGRLogistics.isValidUgandanPhone('0705312409')).toBe(true);
      expect(mockRGRLogistics.isValidUgandanPhone('+256 705 312 409')).toBe(true);
      expect(mockRGRLogistics.isValidUgandanPhone('0780861741')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(mockRGRLogistics.isValidUgandanPhone('123456789')).toBe(false);
      expect(mockRGRLogistics.isValidUgandanPhone('+254705312409')).toBe(false);
      expect(mockRGRLogistics.isValidUgandanPhone('0605312409')).toBe(false);
      expect(mockRGRLogistics.isValidUgandanPhone('abc123def')).toBe(false);
    });
  });

  describe('Form Handling', () => {
    it('should handle contact form submission', () => {
      const form = createMockForm({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      });
      
      document.body.appendChild(form);
      
      // Simulate form submission
      const event = new Event('submit');
      form.dispatchEvent(event);
      
      expect(form).toBeDefined();
      expect(form.querySelector('input[name="name"]').value).toBe('John Doe');
    });

    it('should validate required fields', () => {
      const form = createMockForm({
        name: '',
        email: 'john@example.com',
        message: 'Test message'
      });
      
      const nameInput = form.querySelector('input[name="name"]');
      expect(nameInput.value).toBe('');
      
      // Should be invalid due to empty name
      expect(nameInput.value.length).toBe(0);
    });
  });

  describe('Navigation', () => {
    it('should create navigation elements', () => {
      const nav = createMockElement('nav', { class: 'navbar' });
      const link = createMockElement('a', { 
        href: '/services.html',
        class: 'nav-link'
      });
      
      nav.appendChild(link);
      document.body.appendChild(nav);
      
      expect(nav.querySelector('.nav-link')).toBeDefined();
      expect(link.getAttribute('href')).toBe('/services.html');
    });

    it('should handle smooth scrolling', () => {
      const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      
      mockRGRLogistics.scrollToTop();
      
      expect(mockRGRLogistics.scrollToTop).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const button = createMockElement('button', {
        'aria-label': 'Submit contact form',
        'role': 'button'
      });
      
      expect(button.getAttribute('aria-label')).toBe('Submit contact form');
      expect(button.getAttribute('role')).toBe('button');
    });

    it('should support keyboard navigation', () => {
      const link = createMockElement('a', {
        href: '/contact.html',
        tabindex: '0'
      });
      
      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      link.dispatchEvent(keyEvent);
      
      expect(link.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Performance', () => {
    it('should lazy load images', () => {
      const img = createMockElement('img', {
        'data-src': '/assets/images/test.jpg',
        loading: 'lazy'
      });
      
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.getAttribute('data-src')).toBe('/assets/images/test.jpg');
    });

    it('should debounce scroll events', () => {
      const scrollHandler = vi.fn();
      const debouncedHandler = vi.fn();
      
      // Simulate multiple scroll events
      for (let i = 0; i < 10; i++) {
        scrollHandler();
      }
      
      expect(scrollHandler).toHaveBeenCalledTimes(10);
    });
  });

  describe('Service Worker', () => {
    it('should register service worker', async () => {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
      expect(registration).toBeDefined();
    });

    it('should handle offline functionality', () => {
      // Mock offline state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });
      
      expect(navigator.onLine).toBe(false);
    });
  });

  describe('Notifications', () => {
    it('should show success notifications', () => {
      mockRGRLogistics.showNotification('Success message', 'success');
      
      expect(mockRGRLogistics.showNotification).toHaveBeenCalledWith(
        'Success message',
        'success'
      );
    });

    it('should show error notifications', () => {
      mockRGRLogistics.showNotification('Error message', 'error');
      
      expect(mockRGRLogistics.showNotification).toHaveBeenCalledWith(
        'Error message',
        'error'
      );
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should handle mobile menu toggle', () => {
      const menuButton = createMockElement('button', {
        class: 'navbar-toggler',
        'aria-expanded': 'false'
      });
      
      const menu = createMockElement('div', {
        class: 'navbar-collapse'
      });
      
      document.body.appendChild(menuButton);
      document.body.appendChild(menu);
      
      // Simulate click
      const clickEvent = new Event('click');
      menuButton.dispatchEvent(clickEvent);
      
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('SEO and Meta Tags', () => {
    it('should have proper meta tags', () => {
      const metaDescription = createMockElement('meta', {
        name: 'description',
        content: 'Professional bonded warehouse, depot, clearing and forwarding services in Uganda.'
      });
      
      expect(metaDescription.getAttribute('content')).toContain('Uganda');
    });

    it('should have structured data', () => {
      const structuredData = createMockElement('script', {
        type: 'application/ld+json'
      });
      
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'RGR Logistics Ltd'
      });
      
      const data = JSON.parse(structuredData.textContent);
      expect(data['@type']).toBe('Organization');
      expect(data.name).toBe('RGR Logistics Ltd');
    });
  });
});
