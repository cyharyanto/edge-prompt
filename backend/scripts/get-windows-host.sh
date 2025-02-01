#!/bin/bash

# Get Windows host IP from WSL2
WINDOWS_HOST=$(ip route show | grep -i default | awk '{ print $3}')
echo $WINDOWS_HOST 