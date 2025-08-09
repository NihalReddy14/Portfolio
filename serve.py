#!/usr/bin/env python3
"""
Portfolio Server - Host your portfolio on a custom port
Usage: python3 serve.py [port]
Default port: 8080
"""

import http.server
import socketserver
import sys
import os
import webbrowser
import time

# Get port from command line or use default
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        # CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        # Handle root paths for pages
        if self.path == '/':
            self.path = '/index.html'
        elif self.path.endswith('/'):
            self.path = self.path + 'index.html'
        
        return super().do_GET()

# Change to script directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create server
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"""
╔══════════════════════════════════════════════════════╗
║           🚀 Portfolio Server Started!                ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  📡 Server running at: http://localhost:{PORT:<4}        ║
║  📁 Serving from: {os.getcwd()[:35]:<35} ║
║                                                      ║
║  🌐 Access from other devices on your network:       ║
║     http://[your-ip]:{PORT}                           ║
║                                                      ║
║  📋 Available pages:                                 ║
║     • Home:       http://localhost:{PORT}/             ║
║     • About:      http://localhost:{PORT}/pages/about.html    ║
║     • Skills:     http://localhost:{PORT}/pages/skills.html   ║
║     • Experience: http://localhost:{PORT}/pages/experience.html║
║     • Projects:   http://localhost:{PORT}/pages/projects.html ║
║     • Contact:    http://localhost:{PORT}/pages/contact.html  ║
║                                                      ║
║  Press Ctrl+C to stop the server                     ║
╚══════════════════════════════════════════════════════╝
    """)
    
    # Optional: Open browser automatically
    print("\n🌐 Opening browser...")
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped gracefully")
        print("Thanks for using the portfolio server!")