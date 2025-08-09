#!/usr/bin/env node
/**
 * Portfolio Server - Node.js version
 * Usage: node server.js [port]
 * Default port: 8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Get port from command line or use default
const PORT = process.argv[2] || 8080;

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
    let filePath = '.' + req.url;
    
    // Handle root and directory paths
    if (filePath === './') {
        filePath = './index.html';
    } else if (filePath.endsWith('/')) {
        filePath += 'index.html';
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read and serve file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, there was an error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║           🚀 Portfolio Server Started!                ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  📡 Server running at: http://localhost:${PORT}        ║
║                                                      ║
║  📋 Available pages:                                 ║
║     • Home:       http://localhost:${PORT}/             ║
║     • About:      http://localhost:${PORT}/pages/about.html    ║
║     • Skills:     http://localhost:${PORT}/pages/skills.html   ║
║     • Experience: http://localhost:${PORT}/pages/experience.html║
║     • Projects:   http://localhost:${PORT}/pages/projects.html ║
║     • Contact:    http://localhost:${PORT}/pages/contact.html  ║
║                                                      ║
║  Press Ctrl+C to stop the server                     ║
╚══════════════════════════════════════════════════════╝
    `);
    
    // Open browser
    const { exec } = require('child_process');
    const openCommand = process.platform === 'darwin' ? 'open' : 
                       process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${openCommand} http://localhost:${PORT}`);
});