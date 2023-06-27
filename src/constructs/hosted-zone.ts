import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface HostedZoneProps {
  domainName: string;
}

export class HostedZone extends route53.HostedZone {
  constructor(scope: Construct, id: string, props: HostedZoneProps) {
    super(scope, `Zone.${id}`, {
      zoneName: props.domainName,
    });
  }
}
