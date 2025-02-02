#!/bin/bash

# Store process IDs
MAIN_PID=""

# Cleanup function
cleanup() {
    echo -e "\nShutting down servers..."
    
    # Kill development processes
    pkill -f "tsx watch"
    pkill -f "react-scripts start"
    pkill -f "tsc -w"
    
    # Kill main process if exists
    if [ ! -z "$MAIN_PID" ]; then
        kill $MAIN_PID 2>/dev/null
    fi
    
    # Force kill any remaining processes on these ports
    fuser -k 3000/tcp 2>/dev/null
    fuser -k 3001/tcp 2>/dev/null
    
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM EXIT

# Get Windows host IP from WSL2 (if running in WSL)
if grep -qi microsoft /proc/version; then
    WINDOWS_HOST=$(ip route show | grep -i default | awk '{ print $3}')
    echo "Windows host IP: $WINDOWS_HOST"
    
    # Update .env with Windows host IP
    sed -i "s|LM_STUDIO_URL=.*|LM_STUDIO_URL=http://$WINDOWS_HOST:1234|g" backend/.env
fi

# Install dependencies and build packages
echo "Installing dependencies..."
npm install

# Build common package first
echo "Building common package..."
npm run build:common

# Start development servers with proper cleanup
echo "Starting development servers..."
npm run dev &

# Store the main process PID
MAIN_PID=$!

# Wait for Ctrl+C
wait $MAIN_PID 