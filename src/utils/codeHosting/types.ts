export interface CodeHosting {
  createPR(props: {
    accessToken: string;
    url: string;
    featureBranch: string
    destDirectory: string;
    commitMessage: string;
    svgs: { name: string; code: string }[];
  }): Promise<void>;
}
