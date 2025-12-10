/**
 * JavaScript Obfuscation Build Script
 * This script protects your code by making it extremely difficult to read
 * while keeping full functionality intact.
 */

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Configuration for obfuscation
const obfuscationConfig = {
    // Compact code (no newlines)
    compact: true,
    
    // Control flow flattening makes logic harder to follow
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    
    // Dead code injection adds fake code paths
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    
    // Debug protection prevents console usage
    debugProtection: false, // Set to true for extra protection (can slow down code)
    debugProtectionInterval: 0,
    
    // Disable console output in production
    disableConsoleOutput: false, // Set to true to remove all console.log
    
    // Identifier names generator
    identifierNamesGenerator: 'hexadecimal', // Makes var names like: _0x1a2b, _0x3c4d
    
    // Log false to hide obfuscator output
    log: false,
    
    // Rename variables and functions
    renameGlobals: false, // Keep false to avoid breaking external libraries
    
    // Self defending - crashes if someone tries to format the code
    selfDefending: true,
    
    // String array encoding
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    
    // Transform object keys
    transformObjectKeys: true,
    
    // Unicode escape sequence
    unicodeEscapeSequence: false, // Set to true for extra obfuscation (increases file size)
};

// Directories
const sourceDir = path.join(__dirname, 'ASSETS', 'js');
const outputDir = path.join(__dirname, 'dist', 'js');

// Create output directory if it doesn't exist
function createDirIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✓ Created directory: ${dir}`);
    }
}

// Obfuscate a single file
function obfuscateFile(inputPath, outputPath) {
    try {
        console.log(`\n🔒 Obfuscating: ${path.basename(inputPath)}`);
        
        const code = fs.readFileSync(inputPath, 'utf8');
        const obfuscated = JavaScriptObfuscator.obfuscate(code, obfuscationConfig);
        
        fs.writeFileSync(outputPath, obfuscated.getObfuscatedCode());
        
        const originalSize = (fs.statSync(inputPath).size / 1024).toFixed(2);
        const obfuscatedSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
        
        console.log(`  Original: ${originalSize} KB → Obfuscated: ${obfuscatedSize} KB`);
        console.log(`  ✓ Saved to: ${outputPath}`);
        
        return true;
    } catch (error) {
        console.error(`  ✗ Error obfuscating ${inputPath}:`, error.message);
        return false;
    }
}

// Recursively obfuscate all JS files in a directory
function obfuscateDirectory(srcDir, distDir) {
    const items = fs.readdirSync(srcDir);
    
    items.forEach(item => {
        const srcPath = path.join(srcDir, item);
        const distPath = path.join(distDir, item);
        
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
            createDirIfNotExists(distPath);
            obfuscateDirectory(srcPath, distPath);
        } else if (path.extname(item) === '.js') {
            obfuscateFile(srcPath, distPath);
        }
    });
}

// Main execution
console.log('===========================================');
console.log('  JavaScript Obfuscation Build Tool');
console.log('===========================================');
console.log('\n🛡️  Starting code protection process...\n');

try {
    // Create dist directory structure
    createDirIfNotExists(outputDir);
    
    // Obfuscate all JavaScript files
    obfuscateDirectory(sourceDir, outputDir);
    
    console.log('\n===========================================');
    console.log('✅ Obfuscation completed successfully!');
    console.log('===========================================');
    console.log('\nNext steps:');
    console.log('1. Check the obfuscated files in: dist/js/');
    console.log('2. Test your website with obfuscated JS');
    console.log('3. Update index.html to use dist/js/ paths');
    console.log('4. Deploy the obfuscated version\n');
    
} catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
}
