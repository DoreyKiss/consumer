#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables
. ./scripts/env-setup.sh

# Publish pacts for WebConsumer
pact-broker publish ./pacts \
    --consumer-app-version=$GITHUB_SHA \
    --branch=$GITHUB_BRANCH \
    --broker-base-url=$PACT_BROKER_BASE_URL \
    --broker-token=$PACT_BROKER_TOKEN

# Mark this version as deployed to the dev environment
pact-broker record-deployment \
    --environment=dev \
    --pacticipant=WebConsumer \
    --version=$GITHUB_SHA \
    --broker-base-url=$PACT_BROKER_BASE_URL \
    --broker-token=$PACT_BROKER_TOKEN