/**
 * Form Manager Module
 * Handles contact form validation and submission with Web3Forms
 * Security features: Rate limiting, honeypot, input sanitization
 */

import { FORM_CONFIG, SECURITY_PATTERNS } from '../config/form-config.js';

export class FormManager {
    constructor() {
        this.form = null;
        this.inputs = null;
        this.submitButton = null;
        
        // Load config
        this.config = FORM_CONFIG;
        this.securityPatterns = SECURITY_PATTERNS;
    }

    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        // Only select user-input fields, not hidden fields
        this.inputs = this.form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]), textarea');
        this.submitButton = this.form.querySelector('button[type="submit"]');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Real-time validation
        this.inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const value = this.sanitizeInput(input.value);
        let isValid = true;
        let errorMessage = '';

        switch (input.id) {
            case 'name':
                // Check for minimum length and no suspicious patterns
                isValid = value.length >= this.config.minNameLength && 
                          value.length <= this.config.maxNameLength && 
                          !this.containsSuspiciousContent(value);
                errorMessage = value.length < this.config.minNameLength ? 'Name must be at least 2 characters long' : 
                               value.length > this.config.maxNameLength ? 'Name is too long' : 'Please enter a valid name';
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= this.config.maxEmailLength;
                errorMessage = 'Please enter a valid email address';
                break;
            case 'subject':
                isValid = value.length >= this.config.minSubjectLength && 
                          value.length <= this.config.maxSubjectLength && 
                          !this.containsSuspiciousContent(value);
                errorMessage = value.length < this.config.minSubjectLength ? 'Subject must be at least 5 characters long' :
                               value.length > this.config.maxSubjectLength ? 'Subject is too long' : 'Please enter a valid subject';
                break;
            case 'message':
                isValid = value.length >= this.config.minMessageLength && 
                          value.length <= this.config.maxMessageLength && 
                          !this.containsSuspiciousContent(value);
                errorMessage = value.length < this.config.minMessageLength ? 'Message must be at least 10 characters long' :
                               value.length > this.config.maxMessageLength ? 'Message is too long (max 5000 characters)' : 'Please enter a valid message';
                break;
        }

        this.updateInputStatus(input, isValid, errorMessage);
        return isValid;
    }

    /**
     * Sanitize input to prevent XSS and injection attacks
     */
    sanitizeInput(value) {
        return value.trim()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Check for suspicious content patterns (spam/injection attempts)
     */
    containsSuspiciousContent(value) {
        const hasSuspiciousPattern = this.securityPatterns.suspiciousPatterns.some(pattern => pattern.test(value));
        const hasMultipleUrls = this.securityPatterns.multipleUrlsPattern.test(value);
        
        return hasSuspiciousPattern || hasMultipleUrls;
    }

    updateInputStatus(input, isValid, errorMessage) {
        const inputGroup = input.closest('.input-group');
        let existingError = inputGroup.querySelector('.error-message');
        const errorId = `${input.id}-error`;

        // Remove old error state
        input.classList.remove('error', 'invalid', 'valid');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');

        if (existingError) {
            existingError.remove();
        }

        const hasValue = input.value.trim() !== '';

        if (!isValid && hasValue) {
            // Invalid state
            input.classList.add('invalid');
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', errorId);

            const error = document.createElement('div');
            error.className = 'error-message visible';
            error.id = errorId;
            error.setAttribute('role', 'alert');
            error.textContent = errorMessage;
            inputGroup.appendChild(error);
        } else if (isValid && hasValue) {
            // Valid state
            input.classList.add('valid');
            input.setAttribute('aria-invalid', 'false');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Check honeypot (spam bots will fill this)
        const honeypot = this.form.querySelector('input[name="botcheck"]');
        if (honeypot && honeypot.checked) {
            // Silently reject spam
            console.warn('Spam submission detected');
            this.showNotification('Message sent successfully!', 'success');
            return;
        }

        // Check if all fields have values first
        let hasEmptyFields = false;
        let hasInvalidFields = false;

        this.inputs.forEach(input => {
            const value = input.value.trim();
            if (value === '') {
                hasEmptyFields = true;
            } else if (!this.validateInput(input)) {
                hasInvalidFields = true;
            }
        });

        if (hasEmptyFields) {
            this.showNotification('Please fill in all fields first', 'error');
            return;
        }

        if (hasInvalidFields) {
            this.showNotification('Please fill in all fields correctly', 'error');
            return;
        }

        // Disable form while submitting
        this.setFormState(false);

        try {
            // Get raw form values
            const rawName = this.form.querySelector('#name').value || '';
            const rawEmail = this.form.querySelector('#email').value.trim() || '';
            const rawSubject = this.form.querySelector('#subject').value || 'General Inquiry';
            const rawMessage = this.form.querySelector('#message').value || '';
            
            // Sanitize inputs
            const userName = this.sanitizeInput(rawName) || 'Visitor';
            const userEmail = rawEmail;
            const userSubject = this.sanitizeInput(rawSubject) || 'General Inquiry';
            const userMessage = this.sanitizeInput(rawMessage);

            // Build a clear email body that displays all information
            const emailBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 NEW CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 NAME:
${userName}

📧 EMAIL:
${userEmail || 'not provided'}

📝 SUBJECT:
${userSubject}

💬 MESSAGE:
${userMessage || '(No message provided)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `.trim();
            
            // Create new FormData with only the fields Web3Forms needs
            const formData = new FormData();
            formData.append('access_key', this.config.accessKey);
            formData.append('name', userName);
            formData.append('email', userEmail);
            formData.append('subject', `Portfolio Contact: ${userSubject}`);
            formData.append('message', emailBody);

            // Submit to Web3Forms
            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                body: formData
            });

            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
                this.inputs.forEach(input => input.classList.remove('valid'));
            } else {
                // Log the error for debugging
                console.error('Web3Forms error:', result);
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showNotification('Failed to send message. Please try again later.', 'error');
        } finally {
            this.setFormState(true);
        }
    }

    setFormState(enabled) {
        this.submitButton.disabled = !enabled;
        this.inputs.forEach(input => input.disabled = !enabled);

        if (enabled) {
            this.submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        } else {
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
    }

    showNotification(message, type) {
        // Remove any existing notifications to prevent duplicates
        const existingNotifications = document.querySelectorAll('.form-notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `form-notification form-notification--${type}`;
        
        const iconName = type === 'success' ? 'check-circle' : 'exclamation-circle';
        
        notification.innerHTML = `
            <div class="form-notification__icon">
                <i class="fas fa-${iconName}"></i>
            </div>
            <div class="form-notification__content">
                <div class="form-notification__title">${type === 'success' ? 'Success!' : 'Error'}</div>
                <div class="form-notification__message">${message}</div>
            </div>
            <button class="form-notification__close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Close button handler
        const closeBtn = notification.querySelector('.form-notification__close');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('form-notification--hiding');
            setTimeout(() => notification.remove(), 300);
        });

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('form-notification--visible');
        });

        // Auto dismiss after 6 seconds
        setTimeout(() => {
            notification.classList.add('form-notification--hiding');
            setTimeout(() => notification.remove(), 300);
        }, 6000);
    }
}
