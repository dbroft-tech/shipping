/**
 * RGR Logistics Ltd - Contact Form Handler (Frontend)
 * Handles form submission with validation and user feedback
 */

class ContactForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.messageContainer = this.createMessageContainer();
        
        this.init();
    }
    
    init() {
        if (!this.form) {
            console.error('Contact form not found');
            return;
        }
        
        // Add message container to form
        this.form.appendChild(this.messageContainer);
        
        // Bind events
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Add real-time validation
        this.addRealTimeValidation();
        
        // Add loading states
        this.setupLoadingStates();
    }
    
    createMessageContainer() {
        const container = document.createElement('div');
        container.className = 'form-message';
        container.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            display: none;
            font-weight: 500;
        `;
        return container;
    }
    
    showMessage(message, type = 'info') {
        this.messageContainer.textContent = message;
        this.messageContainer.style.display = 'block';
        
        // Remove existing type classes
        this.messageContainer.classList.remove('success', 'error', 'warning', 'info');
        this.messageContainer.classList.add(type);
        
        // Style based on type
        const styles = {
            success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
            error: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
            warning: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
            info: { backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' }
        };
        
        Object.assign(this.messageContainer.style, styles[type]);
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.hideMessage();
            }, 5000);
        }
        
        // Scroll to message
        this.messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    hideMessage() {
        this.messageContainer.style.display = 'none';
    }
    
    addRealTimeValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required.`;
        }
        
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Phone validation
        else if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,20}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }
        
        // Name validation
        else if (fieldName === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
        }
        
        // Message validation
        else if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#dc3545';
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            `;
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    validateForm() {
        const fields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    setupLoadingStates() {
        // Store original button text
        this.originalButtonText = this.submitButton.textContent;
    }
    
    setLoading(loading) {
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Sending...';
            this.submitButton.style.opacity = '0.7';
            
            // Add loading spinner if available
            const spinner = this.submitButton.querySelector('.spinner');
            if (spinner) {
                spinner.style.display = 'inline-block';
            }
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = this.originalButtonText;
            this.submitButton.style.opacity = '1';
            
            // Hide loading spinner
            const spinner = this.submitButton.querySelector('.spinner');
            if (spinner) {
                spinner.style.display = 'none';
            }
        }
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        // Hide any existing messages
        this.hideMessage();
        
        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Please correct the errors above.', 'error');
            return;
        }
        
        // Set loading state
        this.setLoading(true);
        
        try {
            // Prepare form data
            const formData = new FormData(this.form);
            
            // Send request
            const response = await fetch('contact-handler-advanced.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage(result.message, 'success');
                this.form.reset();
                this.clearAllFieldErrors();
                
                // Optional: Track successful submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'Contact',
                        event_label: 'Contact Form'
                    });
                }
            } else {
                this.showMessage(result.message, 'error');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage(
                'Sorry, there was an error sending your message. Please try again or contact us directly.',
                'error'
            );
        } finally {
            this.setLoading(false);
        }
    }
    
    clearAllFieldErrors() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.clearFieldError(field));
    }
    
    // Public method to reset form
    reset() {
        this.form.reset();
        this.clearAllFieldErrors();
        this.hideMessage();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form if it exists
    const contactForm = document.querySelector('#contact-form, .contact-form, form[action*="contact"]');
    if (contactForm) {
        new ContactForm('#' + contactForm.id || '.contact-form');
    }
    
    // Add CSS for form styling
    const style = document.createElement('style');
    style.textContent = `
        .form-field {
            margin-bottom: 1.5rem;
        }
        
        .form-field label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        
        .form-field input,
        .form-field textarea,
        .form-field select {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
            outline: none;
            border-color: #FFD700;
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }
        
        .form-field input.error,
        .form-field textarea.error,
        .form-field select.error {
            border-color: #dc3545;
        }
        
        .required {
            color: #dc3545;
        }
        
        .submit-button {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .submit-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(30, 60, 114, 0.3);
        }
        
        .submit-button:disabled {
            cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
            .form-field input,
            .form-field textarea,
            .form-field select {
                padding: 0.625rem;
                font-size: 0.9rem;
            }
            
            .submit-button {
                width: 100%;
                padding: 0.875rem;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}
