#!/usr/bin/env node
/**
 * Sandboxed Portfolio Server
 * Runs validation checks before starting the server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;

console.log('🔒 Starting sandboxed portfolio server...\n');

// Run build validation first
console.log('🏗️  Running build validation...');
exec('node build.js', (error, stdout, stderr) => {
    console.log(stdout);
    
    if (error) {
        console.error('❌ Build validation failed:', error);
        process.exit(1);
    }
    
    console.log('✅ Build validation passed!\n');
    startServer();
});

function startServer() {
    // MIME types
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    // Create server
    const server = http.createServer((req, res) => {
        // Security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com data:;");
        
        let filePath = '.' + req.url;
        
        // Handle root and directory paths
        if (filePath === './') {
            filePath = './index.html';
        } else if (filePath.endsWith('/')) {
            filePath += 'index.html';
        }
        
        // Prevent directory traversal
        const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
        
        // Get file extension
        const extname = String(path.extname(safePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        
        // Read and serve file
        fs.readFile(safePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>404 - Not Found</title>
                            <style>
                                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                h1 { color: #e74c3c; }
                                a { color: #3498db; text-decoration: none; }
                            </style>
                        </head>
                        <body>
                            <h1>404 - Page Not Found</h1>
                            <p>The page you're looking for doesn't exist.</p>
                            <a href="/">← Back to Home</a>
                        </body>
                        </html>
                    `, 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end('Server Error: ' + error.code + '\n');
                }
            } else {
                res.writeHead(200, { 
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                });
                res.end(content, 'utf-8');
            }
        });
    });

    // Start server
    server.listen(PORT, () => {
        const boxWidth = 60;
        const line = '═'.repeat(boxWidth - 2);
        
        console.log(`
╔${line}╗
║${'🔒 SANDBOXED PORTFOLIO SERVER'.padEnd(boxWidth - 2)}║
╠${line}╣
║${''.padEnd(boxWidth - 2)}║
║${`📡 Server: http://localhost:${PORT}`.padEnd(boxWidth - 2)}║
║${''.padEnd(boxWidth - 2)}║
║${'🔐 Security Features:'.padEnd(boxWidth - 2)}║
║${'   • CSP headers enabled'.padEnd(boxWidth - 2)}║
║${'   • XSS protection'.padEnd(boxWidth - 2)}║
║${'   • Directory traversal prevention'.padEnd(boxWidth - 2)}║
║${'   • Build validation passed'.padEnd(boxWidth - 2)}║
║${''.padEnd(boxWidth - 2)}║
║${'📱 Network Access:'.padEnd(boxWidth - 2)}║
║${`   http://[your-ip]:${PORT}`.padEnd(boxWidth - 2)}║
║${''.padEnd(boxWidth - 2)}║
║${'Press Ctrl+C to stop'.padEnd(boxWidth - 2)}║
╚${line}╝
        `);
        
        // Auto-open browser
        const openCommand = process.platform === 'darwin' ? 'open' : 
                           process.platform === 'win32' ? 'start' : 'xdg-open';
        exec(`${openCommand} http://localhost:${PORT}`);
    });

    // Handle errors
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use!`);
            console.log(`💡 Try: node sandbox-server.js`);
            console.log(`   with PORT environment variable: PORT=3001 node sandbox-server.js`);
        } else {
            console.error('❌ Server error:', err);
        }
        process.exit(1);
    });
}