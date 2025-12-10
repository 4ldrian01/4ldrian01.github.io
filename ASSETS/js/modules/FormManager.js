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
            
            // Enter key submission for desktop/laptop (except textarea)
            if (input.tagName !== 'TEXTAREA') {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleEnterKeySubmission();
                    }
                });
            }
        });
        
        // Optional: Add Enter key listener to submit button for consistency
        if (this.submitButton) {
            this.submitButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleEnterKeySubmission();
                }
            });
        }
    }
    
    /**
     * Handle Enter key submission with validation
     * Prevents accidental submissions and ensures all fields are valid
     */
    handleEnterKeySubmission() {
        // Check if all fields are filled and valid
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
        
        // Show appropriate feedback
        if (hasEmptyFields) {
            this.showNotification('Please fill in all fields before submitting', 'error');
            return;
        }
        
        if (hasInvalidFields) {
            this.showNotification('Please correct all errors before submitting', 'error');
            return;
        }
        
        // All validations passed - programmatically click the submit button
        // This ensures the existing handleSubmit method is called properly
        if (this.submitButton && !this.submitButton.disabled) {
            this.submitButton.click();
        }
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

        // Check for network connectivity first
        if (!navigator.onLine) {
            this.showNotification('No internet connection. Please check your network and try again.', 'error');
            return;
        }

        // Rate limiting: Prevent rapid submissions (30 second cooldown)
        const lastSubmitTime = localStorage.getItem('lastFormSubmit');
        const now = Date.now();
        if (lastSubmitTime && (now - parseInt(lastSubmitTime)) < this.config.rateLimitMs) {
            const waitTime = Math.ceil((this.config.rateLimitMs - (now - parseInt(lastSubmitTime))) / 1000);
            this.showNotification(`Please wait ${waitTime} seconds before submitting again.`, 'error');
            console.warn('⚠️ Rate limit triggered - user must wait', waitTime, 'seconds');
            return;
        }

        // Check honeypot (spam bots will fill this)
        const honeypot = this.form.querySelector('input[name="botcheck"]');
        if (honeypot && honeypot.checked) {
            // Silently reject spam
            console.warn('⚠️ Spam submission detected - honeypot triggered');
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
            
            // Create JSON payload for Web3Forms
            // Note: Using 'from_name' field instead of 'message' to avoid redundant 'Message:' label
            // Web3Forms displays 'message' with a label, but 'from_name' displays without prefix
            const payload = {
                access_key: this.config.accessKey,
                subject: `Portfolio Contact: ${userSubject}`,
                from_name: emailBody,  // Using from_name to display content without 'Message:' prefix
                botcheck: false  // Disable captcha requirement
            };

            // Submit to Web3Forms with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Check if response is ok first
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response error:', response.status, errorText);
                throw new Error(`Server error: ${response.status}`);
            }

            // Parse JSON response
            const result = await response.json();
            console.log('Web3Forms response:', result); // Debug log
            
            // Check for success in the response object (Web3Forms returns success field)
            if (result.success) {
                // Save timestamp for rate limiting (30 seconds cooldown)
                localStorage.setItem('lastFormSubmit', Date.now().toString());
                
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
                this.inputs.forEach(input => input.classList.remove('valid'));
                
                // Security log: successful submission
                console.log('✅ Form submitted successfully at', new Date().toLocaleString());
            } else {
                // Log the error for debugging
                console.error('Web3Forms error:', result);
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Check if it's a network error
            if (error.name === 'AbortError') {
                this.showNotification('Request timed out. Please check your connection and try again.', 'error');
            } else if (!navigator.onLine) {
                this.showNotification('Lost internet connection. Please check your network and try again.', 'error');
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                this.showNotification('Network error. Please check your connection and try again.', 'error');
            } else {
                this.showNotification('Failed to send message. Please try again later.', 'error');
            }
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
