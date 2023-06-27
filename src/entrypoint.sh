#!/bin/bash

# Set the AWS access key ID and secret access key
export AWS_ACCESS_KEY_ID=$1
export AWS_SECRET_ACCESS_KEY=$2
export AWS_REGION=$3
export S3_BUCKET=$4
export CF_DISTRIBUTION_ID=$5

# Install the project's dependencies
yarn ci

# Build the React app
yarn run build

# Deploy to AWS S3 and CloudFront using the AWS CDK
npx cdk deploy --app 'npx ts-node bin/deploy.ts' --require-approval never
