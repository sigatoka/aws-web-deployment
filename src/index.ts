import core from "@actions/core";
import github from "@actions/github";
import { spawnSync } from "child_process";

async function run() {
  try {
    const accessKeyId = core.getInput("aws-access-key-id", { required: true });
    const secretAccessKey = core.getInput("aws-secret-access-key", {
      required: true,
    });
    const region = core.getInput("aws-region", { required: true });
    const domainName = core.getInput("domain-name", { required: true });

    process.env.AWS_ACCESS_KEY_ID = accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
    process.env.AWS_REGION = region;

    spawnSync(
      "npx",
      [
        "cdk",
        "deploy",
        "--app",
        "npx",
        "ts-node",
        "/app/src/deploy.ts",
        "--require-approval",
        "never",
      ],
      { stdio: "inherit" }
    );

    core.setOutput(
      "deployment-url",
      `https://${domainName}/?branch=${github.context.sha}&run=${github.context.runId}`
    );
  } catch (error) {
    core.setFailed(error);
  }
}

run();
