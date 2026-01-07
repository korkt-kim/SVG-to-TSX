import { CodeHosting } from "./codeHosting";
import { sanitizeComponentName } from "../format";
import { Bitbucket as BitbucketClient } from "bitbucket";
import { APIClient } from "bitbucket/src/plugins/register-endpoints/types";

export class Bitbucket extends CodeHosting {
  private api: APIClient | null = null;
  constructor() {
    super();
  }

  async createPR({
    accessToken,
    url,
    destDirectory,
    featureBranch,
    commitMessage,
    svgs,
  }: Parameters<CodeHosting["createPR"]>[0]) {
    const parsedUrl = this.getParsedGithubUrl(url);
    this.api = new BitbucketClient({
      auth: {
        token: accessToken,
      },
    });

    const workspace = parsedUrl.owner;
    const repoSlug = parsedUrl.name;

    if (!workspace || !repoSlug) {
      throw new Error("Invalid URL");
    }

    await this.api.repositories.get({
      workspace,
      repo_slug: repoSlug,
    });

    const branchExists = await this.checkBranchExists(
      workspace,
      repoSlug,
      featureBranch,
    );

    if (!branchExists) {
      const mainBranchExists = await this.checkBranchExists(
        workspace,
        repoSlug,
        "main",
      );
      if (!mainBranchExists) {
        throw new Error("Failed to get origin branch ref main");
      }


      const mainBranch = await this.api.refs.getBranch({
        workspace,
        repo_slug: repoSlug,
        name: "main",
      });

      await this.api.refs.createBranch({
        workspace,
        repo_slug: repoSlug,
        _body: {
          name: featureBranch,
          target: {
            hash: mainBranch.data.target?.hash,
          },
        },
      });
    }

    for (const svg of svgs) {
      const fileName = `${sanitizeComponentName(svg.name)}.tsx`;
      const filePath = `${destDirectory}/${fileName}`;

      await this.api.repositories.createSrcFileCommit({
        workspace,
        repo_slug: repoSlug,
        _body: {
          message: commitMessage,
          branch: featureBranch,
          [filePath]: svg.code,
        },
      });
    }
  }

  private async checkBranchExists(
    workspace: string,
    repoSlug: string,
    branchName: string,
  ): Promise<boolean> {
    if (!this.api) {
      throw new Error("Bitbucket API not initialized");
    }

    try {
      await this.api.refs.getBranch({
        workspace,
        repo_slug: repoSlug,
        name: branchName,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
