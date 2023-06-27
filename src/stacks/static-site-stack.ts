import * as cdk from "aws-cdk-lib";

import { Certificate, HostedZone, StaticSiteDistribution } from "../constructs";

interface StaticSiteStackProps extends cdk.StackProps {
  assetPath: string;
  domainName: string;
  certificate: Certificate;
  hostedZone: HostedZone;
}

export class StaticSiteStack extends cdk.Stack {
  constructor(
    scope: cdk.App,
    id: string,
    {
      assetPath,
      domainName,
      hostedZone,
      certificate,
      ...props
    }: StaticSiteStackProps
  ) {
    super(scope, id, { ...props, crossRegionReferences: true });

    const distribution = new StaticSiteDistribution(this, "Distribution", {
      domainName: domainName,
      certificate,
    });

    distribution.attachHostedZone(hostedZone);
    distribution.deploySource(assetPath);

    distribution.print();
  }
}
