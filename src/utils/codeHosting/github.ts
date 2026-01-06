import { CodeHosting } from "./types";
import { Octokit } from "@octokit/rest";
import gh from "parse-github-url";
import { SetRequired } from "../../type";
import { sanitizeComponentName } from "../format";

export class GitHub implements CodeHosting {
  private octokit: Octokit | null = null;
  constructor() {}

  async createPR({
    accessToken,
    url,
    destDirectory,
    featureBranch,
    commitMessage,
    svgs,
  }: Parameters<CodeHosting['createPR']>[0]) {
    
    const parsedGithubUrl = this.getParsedGithubUrl(url);
    this.octokit = new Octokit({
      // @TODO: setting 기능으로 baseUrl 만들자
      auth: accessToken,
    });

    const owner = parsedGithubUrl.owner;
    const repoName = parsedGithubUrl.name;

    if (!owner || !repoName ) {
      console.error("Invalid URL. Failed to create PR");
      return;
    }

    await this.octokit.repos.get({
      owner,
      repo: repoName,
    });

    let originBranchRef = null;

    originBranchRef = await this.getBranchRef(owner, repoName, featureBranch);

    if (!originBranchRef) {
      originBranchRef = await this.getBranchRef(owner, repoName, "main");
      if (!originBranchRef) {
        console.error("Failed to get origin branch ref main");
        return;
      }

      await this.octokit.rest.git.createRef({
        owner,
        repo: repoName,
        ref: `refs/heads/${featureBranch}`,
        sha: originBranchRef.data.object.sha,
      });
    }

    const blobs = await Promise.all(
      svgs.map(async (svg) => {
        const blob = await this.octokit?.git.createBlob({
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

    const tree = await this.octokit.git.createTree({
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

    const commit = await this.octokit.git.createCommit({
      owner,
      repo: repoName,
      message: commitMessage,
      tree: tree.data.sha,
      parents: [originBranchRef.data.object.sha],
    });

    await this.octokit.git.updateRef({
      owner,
      repo: repoName,
      ref: `heads/${featureBranch}`,
      sha: commit.data.sha,
      force: true,
    });
  }

  private async getBranchRef(owner: string, repo: string, ref: string) {
    if (!this.octokit) {
      console.error("Octokit not initialized");
      return null;
    }

    try {
      return await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${ref}`,
      });
    } catch (error) {
      return null;
    }
  }

  private getParsedGithubUrl(url: string) {
    const parsedUrl = gh(url);
    if (!parsedUrl) {
      throw new Error("Invalid URL");
    }
    return parsedUrl;
  }
}
