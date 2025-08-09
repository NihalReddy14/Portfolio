#!/usr/bin/env node
/**
 * Build Script for Portfolio
 * Validates HTML, CSS, and JavaScript files for errors
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  Building Portfolio Project...\n');

let errors = [];
let warnings = [];

// Check if all required files exist
function checkRequiredFiles() {
    console.log('📁 Checking required files...');
    const requiredFiles = [
        'index.html',
        'assets/css/global.css',
        'assets/css/home.css',
        'assets/js/main.js',
        'assets/js/three-scene.js',
        'assets/js/animations.js',
        'pages/about.html',
        'pages/skills.html',
        'pages/experience.html',
        'pages/projects.html',
        'pages/contact.html'
    ];

    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            errors.push(`❌ Missing file: ${file}`);
        }
    });
}

// Validate HTML files
function validateHTML() {
    console.log('\n📄 Validating HTML files...');
    const htmlFiles = [
        'index.html',
        'pages/about.html',
        'pages/skills.html',
        'pages/experience.html',
        'pages/projects.html',
        'pages/contact.html'
    ];

    htmlFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for basic HTML structure
            if (!content.includes('<!DOCTYPE html>')) {
                warnings.push(`⚠️  ${file}: Missing DOCTYPE declaration`);
            }
            if (!content.includes('<html')) {
                errors.push(`❌ ${file}: Missing <html> tag`);
            }
            if (!content.includes('<head>')) {
                errors.push(`❌ ${file}: Missing <head> tag`);
            }
            if (!content.includes('<body>')) {
                errors.push(`❌ ${file}: Missing <body> tag`);
            }
            
            // Check for broken links
            const linkRegex = /href=["']([^"']+)["']/g;
            let match;
            while ((match = linkRegex.exec(content)) !== null) {
                const link = match[1];
                if (link.startsWith('/') && !link.startsWith('//') && !link.startsWith('/#')) {
                    const linkPath = link.substring(1);
                    if (!fs.existsSync(linkPath) && !link.includes('#')) {
                        warnings.push(`⚠️  ${file}: Broken link: ${link}`);
                    }
                }
            }
            
            console.log(`✅ ${file} validated`);
        }
    });
}

// Check CSS files
function validateCSS() {
    console.log('\n🎨 Checking CSS files...');
    const cssDir = 'assets/css';
    
    if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
        
        cssFiles.forEach(file => {
            const filePath = path.join(cssDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for common CSS issues
            if (content.includes('undefined')) {
                warnings.push(`⚠️  ${filePath}: Contains 'undefined'`);
            }
            
            // Check for empty rules
            const emptyRules = content.match(/{\s*}/g);
            if (emptyRules && emptyRules.length > 0) {
                warnings.push(`⚠️  ${filePath}: Contains ${emptyRules.length} empty CSS rules`);
            }
            
            console.log(`✅ ${filePath} checked`);
        });
    }
}

// Check JavaScript files
function validateJS() {
    console.log('\n📜 Checking JavaScript files...');
    const jsDir = 'assets/js';
    
    if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
        
        jsFiles.forEach(file => {
            const filePath = path.join(jsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for console.logs (optional - these might be intentional)
            const consoleLogs = (content.match(/console\.log/g) || []).length;
            if (consoleLogs > 0) {
                warnings.push(`⚠️  ${filePath}: Contains ${consoleLogs} console.log statements`);
            }
            
            // Check for basic syntax
            try {
                new Function(content);
                console.log(`✅ ${filePath} syntax valid`);
            } catch (e) {
                errors.push(`❌ ${filePath}: JavaScript syntax error: ${e.message}`);
            }
        });
    }
}

// Create a production build
function createBuild() {
    console.log('\n📦 Creating production build...');
    
    const buildDir = 'dist';
    
    // Create build directory
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }
    
    console.log('✅ Build directory created');
    
    // Copy all files to dist (in a real build, you'd minify and optimize)
    console.log('📋 Copying files to build directory...');
    
    // For now, we'll just validate that everything is in place
    console.log('✅ Build process complete (validation only)');
}

// Run all checks
console.log('🚀 Starting build process...\n');

checkRequiredFiles();
validateHTML();
validateCSS();
validateJS();
createBuild();

// Report results
console.log('\n📊 Build Summary:');
console.log('─'.repeat(50));

if (errors.length === 0) {
    console.log('✅ No errors found!');
} else {
    console.log(`❌ ${errors.length} errors found:`);
    errors.forEach(error => console.log(error));
}

if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warnings:`);
    warnings.forEach(warning => console.log(warning));
}

console.log('\n🎉 Build validation complete!');

// Exit with error code if there are errors
process.exit(errors.length > 0 ? 1 : 0);