import { CodeHosting } from "./codeHosting";
import { Octokit } from "@octokit/rest";
import { SetRequired } from "../../type";
import { sanitizeComponentName } from "../format";

export class GitHub extends CodeHosting {
  private api: Octokit | null = null;
  constructor() {
    super()
  }

  async createPR({
    accessToken,
    url,
    destDirectory,
    featureBranch,
    commitMessage,
    svgs,
  }: Parameters<CodeHosting["createPR"]>[0]) {
    const parsedGithubUrl = this.getParsedGithubUrl(url);
    this.api = new Octokit({
      // @TODO: setting 기능으로 baseUrl 만들자
      auth: accessToken,
    });

    const owner = parsedGithubUrl.owner;
    const repoName = parsedGithubUrl.name;

    if (!owner || !repoName) {
      throw new Error("Invalid URL");
    }

    await this.api.repos.get({
      owner,
      repo: repoName,
    });

    let originBranchRef = null;

    originBranchRef = await this.getBranchRef(owner, repoName, featureBranch);

    if (!originBranchRef) {
      originBranchRef = await this.getBranchRef(owner, repoName, "main");
      if (!originBranchRef) {
        throw new Error("Failed to get origin branch ref main");
      }

      await this.api.rest.git.createRef({
        owner,
        repo: repoName,
        ref: `refs/heads/${featureBranch}`,
        sha: originBranchRef.data.object.sha,
      });
    }

    const blobs = await Promise.all(
      svgs.map(async (svg) => {
        const blob = await this.api?.git.createBlob({
          owner,
          repo: repoName,
          content: btoa(svg.code),
          encoding: "base64",
        });

        return {
          ...blob,
          name: `${sanitizeComponentName(svg.name)}.tsx`,
        };
      }),
    );

    const tree = await this.api.git.createTree({
      owner,
      repo: repoName,
      tree: (
        blobs.filter((blob) => !!blob.data) as SetRequired<
          (typeof blobs)[number],
          "data"
        >[]
      ).map((blob) => {
        return {
          type: "blob",
          sha: blob.data.sha,
          mode: "100644",
          path: `${destDirectory}/${blob.name}`,
        };
      }),
      base_tree: originBranchRef.data.object.sha,
    });

    const commit = await this.api.git.createCommit({
      owner,
      repo: repoName,
      message: commitMessage,
      tree: tree.data.sha,
      parents: [originBranchRef.data.object.sha],
    });

    await this.api.git.updateRef({
      owner,
      repo: repoName,
      ref: `heads/${featureBranch}`,
      sha: commit.data.sha,
      force: true,
    });
  }

  private async getBranchRef(owner: string, repo: string, ref: string) {
    if (!this.api) {
      throw new Error("Octokit not initialized");
    }

    try {
      return await this.api.git.getRef({
        owner,
        repo,
        ref: `heads/${ref}`,
      });
    } catch (error) {
      return null;
    }
  }
}
