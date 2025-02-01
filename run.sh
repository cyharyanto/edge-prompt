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

# Create a cleanup function
cleanup() {
    echo "Shutting down servers..."
    kill $(lsof -t -i:3000) 2>/dev/null # Kill frontend
    kill $(lsof -t -i:3001) 2>/dev/null # Kill backend
    exit 0
}

# Set up trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

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

# Start backend in background and save PID
cd ../backend
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!

# Start frontend in background and save PID
cd ../frontend
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

# Function to follow logs
follow_logs() {
    echo "Following logs... (Press Ctrl+C to stop servers)"
    echo "Backend log:"
    tail -f ../backend/backend.log &
    echo "Frontend log:"
    tail -f frontend.log
}

# Follow logs and wait for Ctrl+C
follow_logs

# Keep script running until Ctrl+C
wait 