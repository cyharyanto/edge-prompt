#!/bin/bash

# Default LM Studio URL
DEFAULT_LM_STUDIO_URL="http://localhost:1234"
LM_STUDIO_URL=""

# Process command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --lm-studio-url=*)
      LM_STUDIO_URL="${1#*=}"
      shift
      ;;
    --lm-studio-url)
      LM_STUDIO_URL="$2"
      shift 2
      ;;
    *)
      # Unknown option
      shift
      ;;
  esac
done

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
if [ -z "$LM_STUDIO_URL" ]; then
    if grep -qi microsoft /proc/version; then
        WINDOWS_HOST=$(ip route show | grep -i default | awk '{ print $3}')
        echo "Windows host IP detected: $WINDOWS_HOST"
        LM_STUDIO_URL="http://$WINDOWS_HOST:1234"
    else
        LM_STUDIO_URL="$DEFAULT_LM_STUDIO_URL"
    fi
    echo "Using auto-detected LM Studio URL: $LM_STUDIO_URL"
else
    echo "Using provided LM Studio URL: $LM_STUDIO_URL"
fi

# Update .env with the LM Studio URL
ENV_FILE="backend/.env"

# Preserve existing .env settings, update or append LM_STUDIO_URL
if grep -q "^LM_STUDIO_URL=" "$ENV_FILE"; then
  # Replace existing LM_STUDIO_URL
  sed -i '' "s|^LM_STUDIO_URL=.*|LM_STUDIO_URL=$LM_STUDIO_URL|" "$ENV_FILE"
else
  # Append LM_STUDIO_URL if not found
  echo "LM_STUDIO_URL=$LM_STUDIO_URL" >> "$ENV_FILE"
fi


# Print connection info
echo "================================================================="
echo "EdgePrompt will connect to LM Studio at: $LM_STUDIO_URL"
echo "If this is incorrect, press Ctrl+C and restart with:"
echo "  ./run.sh --lm-studio-url=http://your-lm-studio-ip:1234"
echo "================================================================="

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