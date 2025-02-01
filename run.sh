#!/bin/bash

# Function to get Windows host IP
get_windows_host() {
    # Get Windows host IP from WSL2
    ip route show | grep -i default | awk '{ print $3}'
}

# Function to check LM Studio availability
check_lm_studio() {
    echo "Checking LM Studio connection..."
    WINDOWS_HOST=$(get_windows_host)
    echo "Using Windows host: $WINDOWS_HOST"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://${WINDOWS_HOST}:1234/v1/models")
    
    if [ "$response" = "200" ]; then
        echo "LM Studio is running and accessible"
        # Create/update .env file with correct host
        cat > backend/.env << EOF
# Windows host IP as seen from WSL2
LM_STUDIO_URL=http://${WINDOWS_HOST}:1234
PORT=3001
EOF
        return 0
    else
        echo "Error: Cannot connect to LM Studio"
        echo "Response code: $response"
        echo "Please ensure:"
        echo "1. LM Studio is running on Windows"
        echo "2. It's listening on port 1234"
        echo "3. A model is loaded in LM Studio"
        echo "4. Windows Defender is not blocking the connection"
        return 1
    fi
}

# Store process IDs
BACKEND_PID=""
FRONTEND_PID=""

# Cleanup function
cleanup() {
    echo "Shutting down servers..."
    
    # Kill backend if running
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    
    # Kill frontend if running
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    # Kill any remaining processes on the ports
    kill $(lsof -t -i:3000) 2>/dev/null
    kill $(lsof -t -i:3001) 2>/dev/null
    
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM EXIT

# Check LM Studio before proceeding
if ! check_lm_studio; then
    exit 1
fi

# Install backend dependencies
cd backend
echo "Installing backend dependencies..."
npm install
npm run build

# Install frontend dependencies
cd ../frontend
echo "Installing frontend dependencies..."
npm install

# Start servers
echo "Starting servers..."

# Start backend
cd ../backend
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start and check for errors
sleep 5
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "Backend failed to start. Check backend.log for errors:"
    cat backend.log
    cleanup
    exit 1
fi

# Check if backend is responding
if ! curl -s http://localhost:3001/api/health > /dev/null; then
    echo "Backend is not responding. Check backend.log for errors:"
    cat backend.log
    cleanup
    exit 1
fi

# Only proceed with frontend if backend is running
echo "Backend started successfully. Installing frontend dependencies..."
cd ../frontend
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

# Function to follow logs
follow_logs() {
    echo "Following logs... (Press Ctrl+C to stop servers)"
    tail -f ../backend/backend.log frontend.log
}

# Follow logs and wait
follow_logs

# Wait for Ctrl+C
wait 