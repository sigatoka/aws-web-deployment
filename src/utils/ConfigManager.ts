export class ConfigManager {
  static get region(): string {
    return process.env.REGION ?? "ap-southeast-2";
  }

  static get account(): string | undefined {
    return process.env.ACCOUNT;
  }

  public static domainName(subdomain?: string): string {
    const domainName = process.env.DOMAIN_NAME ?? "ello.social";

    if (!subdomain) return domainName;

    return `${subdomain}.${domainName}`;
  }

  static get globalCertificateArn(): string {
    return process.env.GLOBAL_CERTIFICATE_ARN ?? "";
  }

  static get environment(): string {
    return process.env.ENVIRONMENT ?? "development";
  }

  static get sentryDSN(): string | undefined {
    return process.env.SENTRY_DSN;
  }

  static get env(): { account: string | undefined; region: string } {
    return {
      account: ConfigManager.account,
      region: ConfigManager.region,
    };
  }
}
