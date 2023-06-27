FROM node:16

LABEL "com.github.actions.name"="Deploy React App to AWS S3 and CloudFront"
LABEL "com.github.actions.description"="Deploy a React app to AWS S3 and CloudFront using the AWS CDK"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="blue"

RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip3 install awscli

COPY . /app
WORKDIR /app

RUN yarn install && yarn build

ENTRYPOINT ["node", "/app/dist/index.js"]
