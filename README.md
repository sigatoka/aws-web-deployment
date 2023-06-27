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
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          build-directory: ./dist
          domain-name: subdomain.domain.com
```
