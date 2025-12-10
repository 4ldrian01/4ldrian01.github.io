/**
 * Form Configuration
 * Contains settings for the contact form submission
 * 
 * SECURITY NOTES:
 * - This access key is designed to be public (Web3Forms handles security server-side)
 * - Web3Forms FREE plan works on ANY domain (no domain restrictions)
 * - Never store sensitive credentials (passwords, private API keys) in frontend code
 * 
 * DEPLOYMENT:
 * This form works on:
 * - Localhost (http://127.0.0.1:5502 or any local server)
 * - GitHub Pages (https://4ldrian01.github.io)
 * - Any other domain (Web3Forms free plan has no domain restrictions)
 */

export const FORM_CONFIG = {
    // Web3Forms endpoint
    endpoint: 'https://api.web3forms.com/submit',
    
    // Your Web3Forms access key (safe to be public)
    accessKey: '2e408031-438d-4efd-a25a-919ba433439c',
    
    // Rate limiting settings
    rateLimitMs: 30000,           // 30 seconds between submissions
    maxSubmitsPerSession: 5,       // Max 5 submissions per browser session
    
    // Validation settings
    maxNameLength: 100,
    maxEmailLength: 254,
    maxSubjectLength: 200,
    maxMessageLength: 5000,
    minNameLength: 2,
    minSubjectLength: 5,
    minMessageLength: 10,
    
    // Email recipient (for reference - configured in Web3Forms dashboard)
    recipientEmail: 'aldriansahid30@gmail.com'
};

/**
 * Security patterns to detect potential spam/injection
 */
export const SECURITY_PATTERNS = {
    suspiciousPatterns: [
        /<script/i,
        /javascript:/i,
        /onclick/i,
        /onerror/i,
        /onload/i,
        /eval\(/i,
        /\[url=/i,
        /\[link=/i,
        /data:/i,
        /vbscript:/i
    ],
    
    // Detect excessive URLs (common in spam)
    multipleUrlsPattern: /http[s]?:\/\/.*http[s]?:\/\//i
};
