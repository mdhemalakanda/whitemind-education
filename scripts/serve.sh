#!/bin/bash
# Serve the built Whitemind site locally — http://localhost:8140
cd "$(dirname "$0")/../site" && python3 -m http.server 8140
