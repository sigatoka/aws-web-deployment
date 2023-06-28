#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import * as path from "path";

import "source-map-support/register";

import { StaticSiteStack } from "./stacks";
import { Certificate, HostedZone } from "./constructs";
import { ConfigManager } from "./utils";

const app = new cdk.App();

const hostedZone = new HostedZone(app, "HostedZone", {
  domainName: ConfigManager.domainName(),
});

const certificate = new Certificate(app, "Certificate", {
  domainName: ConfigManager.domainName(),
  hostedZone,
});

new StaticSiteStack(app, "App", {
  env: ConfigManager.env,
  assetPath: path.resolve(__dirname, "../../web/build"),
  domainName: ConfigManager.domainName("app"),
  certificate: certificate,
  hostedZone: hostedZone,
});

app.synth();
