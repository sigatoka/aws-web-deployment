import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

import { Certificate } from "./certificate";

interface StaticSiteDistributionProps {
  domainName: string;
  certificate?: Certificate;
  certificateArn?: string;
  indexDocument?: string;
  errorDocument?: string;
}

export class StaticSiteDistribution extends Construct {
  private domainName: string;
  private bucket: s3.Bucket;
  private distribution: cloudfront.CloudFrontWebDistribution;

  constructor(
    scope: Construct,
    id: string,
    props: StaticSiteDistributionProps
  ) {
    super(scope, id);

    this.domainName = props.domainName;

    this.bucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: this.domainName,
      websiteIndexDocument: props.indexDocument ?? "index.html",
      websiteErrorDocument: props.errorDocument ?? "index.html",
      versioned: false,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
      lifecycleRules: [
        {
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(
            Common.Days.Ninety
          ),
          expiration: cdk.Duration.days(Common.Days.Yearly),
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(Common.Days.Thirty),
            },
          ],
        },
      ],
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity",
      {
        comment: "Static Site Access Identity",
      }
    );

    const cloudFrontRole = new iam.Role(this, "CloudFrontRole", {
      assumedBy: new iam.ServicePrincipal("cloudfront.amazonaws.com"),
    });

    cloudFrontRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject", "s3:ListBucket"],
        effect: iam.Effect.ALLOW,
        resources: [this.bucket.bucketArn, `${this.bucket.bucketArn}/*`],
      })
    );

    const viewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate(
      this.certificateFromProps(props),
      { aliases: [this.domainName] }
    );

    this.distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "SiteDistribution",
      {
        comment: this.domainName,
        viewerCertificate,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: this.bucket,
              originAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    this.bucket.grantRead(cloudFrontRole);
  }

  private certificateFromProps = (
    props: StaticSiteDistributionProps
  ): Certificate | acm.ICertificate => {
    if (props.certificate) return props.certificate;

    if (props.certificateArn) {
      return acm.Certificate.fromCertificateArn(
        this,
        "Certificate",
        props.certificateArn
      );
    }

    return new acm.Certificate(this, "Certificate", {
      domainName: this.domainName,
    });
  };

  /**
   * Adds the appropriate domain records and connects
   * with the distribution.
   *
   * @param hostedZone Initialized hosted zone
   */
  public attachHostedZone = (hostedZone: route53.IHostedZone): void => {
    new route53.ARecord(this, "AliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(this.distribution)
      ),
      recordName: this.domainName,
    });
  };

  /**
   *
   * @param sourcePath Path to source assets
   */
  public deploySource = (sourcePath: string): s3Deploy.BucketDeployment =>
    new s3Deploy.BucketDeployment(this, "SiteDeployment", {
      sources: [s3Deploy.Source.asset(sourcePath)],
      destinationBucket: this.bucket,
      distribution: this.distribution,
    });
}
