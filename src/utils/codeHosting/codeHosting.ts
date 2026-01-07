import gitUrlParse from "git-url-parse";

export abstract class CodeHosting {
  abstract createPR(props: {
    accessToken: string;
    url: string;
    featureBranch: string;
    destDirectory: string;
    commitMessage: string;
    svgs: { name: string; code: string }[];
  }): Promise<void>;

  getParsedGithubUrl(url: string) {
    const parsedUrl = gitUrlParse(url);
    if (!parsedUrl) {
      throw new Error("Invalid URL");
    }
    return parsedUrl;
  }
}
