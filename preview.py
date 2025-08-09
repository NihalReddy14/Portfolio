#!/usr/bin/env python3
"""
Simple HTTP server for previewing the portfolio
Run: python3 preview.py
Then open: http://localhost:8000
"""

import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        # Handle root paths for pages
        if self.path == '/':
            self.path = '/index.html'
        elif self.path.endswith('/'):
            self.path = self.path + 'index.html'
        
        return super().do_GET()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"🚀 Portfolio server running at http://localhost:{PORT}")
    print("📁 Serving from:", os.getcwd())
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")