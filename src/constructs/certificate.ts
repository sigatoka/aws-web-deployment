import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface CertificateProps extends acm.CertificateProps {
  domainName: string;
  hostedZone: route53.HostedZone | route53.IHostedZone;
}

export class Certificate extends acm.Certificate {
  constructor(scope: Construct, id: string, props: CertificateProps) {
    super(scope, `Certificate.${id}`, {
      ...props,
      domainName: props.domainName,
      subjectAlternativeNames: Certificate.alternateNamesFromDomain(
        props.domainName
      ),
      validation: acm.CertificateValidation.fromDns(props.hostedZone),
    });
  }

  private static alternateNamesFromDomain = (domainName: string): string[] => [
    `*.${domainName}`,
  ];
}
