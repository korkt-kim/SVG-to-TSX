import { useEffect, useRef } from "react";
import { CodeHosting } from "../utils/codeHosting/types";
import { useGlobalContext } from "./GlobalProvider";
import { GitHub } from "../utils/codeHosting/github";
import { useFigmaPersistentValue } from "../libs/FigmaPersistentValue";
import { CommonLayout } from "../layouts/CommonLayout";

const InputIDs = {
  accessToken: "accessToken",
  repoUrl: "repoUrl",
  featureBranch: "featureBranch",
  iconDirectory: "iconDirectory",
  commitMessage: "commitMessage",
};

export const ExportStep = () => {
  const globalContext = useGlobalContext();
  const codeHostingRef = useRef<CodeHosting | null>(null);
  const { value, savePersistentValue } = useFigmaPersistentValue();

  const loadInitialValue = () => {
    Object.entries(value).forEach(([key, value]) => {
      const input = document.getElementById(key);
      if (!input || !(input instanceof HTMLInputElement)) {
        return;
      }

      input.value = value;
    });
  };

  useEffect(() => {
    loadInitialValue();
  }, []);

  if (!codeHostingRef.current) {
    codeHostingRef.current = new GitHub();
  }

  return (
    <CommonLayout>
      <CommonLayout.Content>
        <form
          id="export"
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={(e) => {
            e.preventDefault();
            codeHostingRef.current?.createPR({
              accessToken: e.currentTarget.accessToken.value,
              // @TODO bitbucket, gitlab 범위 확대. Interface UrlParser로 만들자
              url: e.currentTarget.repoUrl.value,
              featureBranch: e.currentTarget.featureBranch.value,
              destDirectory: e.currentTarget.iconDirectory.value,
              commitMessage: e.currentTarget.commitMessage.value,
              svgs:
                globalContext?.tsxCodes.map((tsx) => ({
                  name: tsx.name,
                  code: tsx.tsx,
                })) || [],
            });
          }}
        >
          <label htmlFor={InputIDs.accessToken}>Access Token</label>
          <input
            type="password"
            id={InputIDs.accessToken}
            onChange={(e) =>
              savePersistentValue(InputIDs.accessToken, e.target.value)
            }
          />
          <label htmlFor={InputIDs.repoUrl}>repo url</label>
          <input
            type="text"
            id={InputIDs.repoUrl}
            onChange={(e) =>
              savePersistentValue(InputIDs.repoUrl, e.target.value)
            }
          />
          <label htmlFor={InputIDs.featureBranch}>Feature branch</label>
          <input
            type="text"
            id={InputIDs.featureBranch}
            onChange={(e) =>
              savePersistentValue(InputIDs.featureBranch, e.target.value)
            }
          />
          <label htmlFor={InputIDs.iconDirectory}>Icon directory</label>
          <input
            type="text"
            id={InputIDs.iconDirectory}
            onChange={(e) =>
              savePersistentValue(InputIDs.iconDirectory, e.target.value)
            }
          />
          <label htmlFor={InputIDs.commitMessage}>Commit message</label>
          <textarea id={InputIDs.commitMessage} />
        </form>
      </CommonLayout.Content>
      <CommonLayout.Bottom>
        <button type="submit" form="export">
          Export
        </button>
      </CommonLayout.Bottom>
    </CommonLayout>
  );
};
