How to use:

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
          node-version: '16.x'

      - name: Install dependencies
        run: npm ci

      - name: Build React App
        run: npm run build

      - name: Deploy to AWS S3 and CloudFront
        uses: my-org/aws-cdk-react-deploy-action@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          s3-bucket: my-s3-bucket
          cf-distribution-id: my-cloudfront-distribution
```