#!/bin/bash

echo "Preparing a simple deploy package for AWS Elastic Beanstalk..."

# Remove any previous deploy.zip file if it exists
rm -f deploy.zip

# Install only production dependencies
npm install --production

# Generate the Prisma client for database access
echo "Generating Prisma client..."
npm run db:generate

# Build the application (compile TypeScript to JavaScript)
echo "Building the application..."
npm run build

# Create a zip file with only the necessary files for deployment
echo "Creating deploy.zip with build output and dependencies..."
zip -r deploy.zip dist/ node_modules/ package.json package-lock.json Procfile prisma/schema.prisma

echo "deploy.zip has been created successfully."
echo "You can now upload this file to AWS Elastic Beanstalk." 