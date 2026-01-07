import { CodeHosting } from "./codeHosting";
import { sanitizeComponentName } from "../format";
import { Gitlab } from "@gitbeaker/rest";

export class GitLab extends CodeHosting {
  private api: Gitlab<false> | null = null;
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
    this.api = new Gitlab({
      token: accessToken,
    });

    const owner = parsedUrl.owner;
    const repoName = parsedUrl.name;

    if (!owner || !repoName) {
      throw new Error("Invalid URL");
    }

    console.log(owner, repoName);

    const projectId = `${owner}/${repoName}`;

    await this.api.Projects.show(projectId);

    const branchExists = await this.checkBranchExists(projectId, featureBranch);

    if (!branchExists) {
      const mainBranchExists = await this.checkBranchExists(projectId, "main");
      if (!mainBranchExists) {
        throw new Error("Failed to get origin branch ref main");
      }

      await this.api.Branches.create(projectId, featureBranch, "main");
    }

    const actions = svgs.map((svg) => ({
      action: "create" as const,
      filePath: `${destDirectory}/${sanitizeComponentName(svg.name)}.tsx`,
      content: svg.code,
    }));

    await this.api.Commits.create(
      projectId,
      featureBranch,
      commitMessage,
      actions,
    );
  }

  private async checkBranchExists(
    projectId: string,
    branchName: string,
  ): Promise<boolean> {
    if (!this.api) {
      throw new Error("GitLab API not initialized");
    }

    try {
      await this.api.Branches.show(projectId, branchName);
      return true;
    } catch (error) {
      return false;
    }
  }
}
