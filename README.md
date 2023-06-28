```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # Additional setup and build steps...
      - name: Deploy bundle
        uses: sigatoka/aws-web-deployment@main
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          build-directory: ./dist
          domain-name: subdomain.domain.com
```

## Usage examples

```yaml
name: Deploy React App to AWS

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16.x"
      - name: Install dependencies
        run: yarn install
      - name: Build React App
        run: yarn build
      - name: Deploy bundle
        uses: sigatoka/aws-web-deployment@main
        with:
          aws-account: ${{ secrets.AWS_ACCOUNT }}
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION || 'ap-southeast-2' }}
          build-directory: ./dist
          domain-name: subdomain.domain.com
```

Deploying with an existing AWS configuration

> Currently not supported

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # Setup and build steps...
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION || 'ap-southeast-2' }}
      - name: Deploy bundle
        uses: sigatoka/aws-web-deployment@main
        with:
          build-directory: ./dist
          domain-name: subdomain.domain.com
```
