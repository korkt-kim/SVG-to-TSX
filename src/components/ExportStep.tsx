import { useRef } from "react";
import { CodeHosting } from "../utils/codeHosting/types";
import { useGlobalContext } from "./GlobalProvider";
import { GitHub } from "../utils/codeHosting/github";
import { sanitizeComponentName } from "../utils/format";

export const ExportStep = () => {
  const globalContext = useGlobalContext();
  const codeHostingRef = useRef<CodeHosting | null>(null);

  if (!codeHostingRef.current) {
    codeHostingRef.current = new GitHub();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const accessToken = e.currentTarget.accessToken.value;
        const repoWorkspace = e.currentTarget.repoWorkspace.value;
        const repoName = e.currentTarget.repoName.value;
        const iconDirectory = e.currentTarget.iconDirectory.value;
        const featureBranch = e.currentTarget.featureBranch.value;
        const commitMessage = e.currentTarget.commitMessage.value;

        codeHostingRef.current?.createPR({
          accessToken,
          url: `https://github.com/${repoWorkspace}/${repoName}#${featureBranch}`,
          destDirectory: iconDirectory,
          commitMessage,
          svgs:
            globalContext?.tsxCodes.map((tsx) => ({
              name: sanitizeComponentName(tsx.name),
              code: tsx.tsx,
            })) || [],
        });
      }}
    >
      <label htmlFor="accessToken">Access Token</label>
      <input type="password" id="accessToken" />
      <label htmlFor="repoWorkspace">repo workspace</label>
      <input type="text" id="repoWorkspace" />
      <label htmlFor="repoName">Repo name</label>
      <input type="text" id="repoName" />
      <label htmlFor="iconDirectory">Icon directory</label>
      <input type="text" id="iconDirectory" />
      <label htmlFor="featureBranch">Feature branch</label>
      <input type="text" id="featureBranch" />
      <label htmlFor="commitMessage">Commit message</label>
      <textarea id="commitMessage" />
      <button type="submit">Export</button>
    </form>
  );
};
