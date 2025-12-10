/**
 * CONTACT FORM TESTING SCRIPT
 * This script helps you test the contact form locally and in production
 * 
 * HOW TO USE:
 * 1. Open browser console (F12)
 * 2. Type: testContactForm()
 * 3. Check the results in the console
 */

async function testContactForm() {
    console.log('🧪 Testing Contact Form Submission...\n');
    
    const endpoint = 'https://api.web3forms.com/submit';
    const accessKey = '2e408031-438d-4efd-a25a-919ba433439c';
    
    const testData = {
        access_key: accessKey,
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Portfolio Contact: Test Submission',
        message: 'This is a test message from the form.',
        botcheck: false  // Disable captcha requirement
    };
    
    console.log('📤 Sending test data:', testData);
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        console.log('📡 Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Server Error:', errorText);
            return;
        }
        
        const result = await response.json();
        console.log('📬 Response data:', result);
        
        if (result.success) {
            console.log('✅ SUCCESS! Form submission is working correctly.');
            console.log('✉️ Message:', result.message);
        } else {
            console.error('❌ FAILED! Error from Web3Forms:', result.message);
        }
        
    } catch (error) {
        console.error('❌ REQUEST FAILED:', error.message);
        console.error('Error details:', error);
    }
}

// Make function globally available
window.testContactForm = testContactForm;
