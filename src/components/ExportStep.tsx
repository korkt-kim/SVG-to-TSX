import { useEffect, useRef, useState } from "react";
import { CodeHosting } from "../utils/codeHosting/types";
import { useGlobalContext } from "./GlobalProvider";
import { GitHub } from "../utils/codeHosting/github";
import { useFigmaPersistentValue } from "../libs/FigmaPersistentValue";
import { CommonLayout } from "../layouts/CommonLayout";
import { useCheckFormValidation } from "../hooks/useCheckFormValidation";
import { useErrorContext } from "./ErrorProvider";

const InputIDs = {
  accessToken: "accessToken",
  repoUrl: "repoUrl",
  featureBranch: "featureBranch",
  iconDirectory: "iconDirectory",
  commitMessage: "commitMessage",
};

const isValidInputElement = (
  input: Element,
): input is HTMLInputElement | HTMLTextAreaElement => {
  return (
    input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement
  );
};

export const ExportStep = () => {
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const globalContext = useGlobalContext();
  const errorContext = useErrorContext();
  const codeHostingRef = useRef<CodeHosting | null>(null);
  const { value, savePersistentValue } = useFigmaPersistentValue();
  const [isFormValid, formRef, handleInputChange] = useCheckFormValidation();

  const loadInitialValue = () => {
    Object.entries(value).forEach(([key, value]) => {
      const input = document.getElementById(key);
      if (!input || !isValidInputElement(input)) {
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
          ref={formRef}
          id="export"
          className="form form--vertical"
          onSubmit={async (e) => {
            e.preventDefault();
            errorContext.setErrorMessage("");
            setIsCreatingPR(true);
            try {
              await codeHostingRef.current?.createPR({
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

              globalContext.proceedStep();
            } catch (e) {
              if (e instanceof Error) {
                errorContext.setErrorMessage(e.message);
              }
            } finally {
              setIsCreatingPR(false);
            }
          }}
        >
          <label htmlFor={InputIDs.accessToken}>Access Token</label>
          <input
            required
            className="input"
            type="password"
            id={InputIDs.accessToken}
            onChange={(e) => {
              savePersistentValue(InputIDs.accessToken, e.target.value);
              handleInputChange();
            }}
          />
          <label htmlFor={InputIDs.repoUrl}>repo url</label>
          <input
            required
            className="input"
            type="text"
            id={InputIDs.repoUrl}
            onChange={(e) => {
              savePersistentValue(InputIDs.repoUrl, e.target.value);
              handleInputChange();
            }}
          />
          <label htmlFor={InputIDs.featureBranch}>Feature branch</label>
          <input
            required
            className="input"
            type="text"
            id={InputIDs.featureBranch}
            onChange={(e) => {
              savePersistentValue(InputIDs.featureBranch, e.target.value);
              handleInputChange();
            }}
          />
          <label htmlFor={InputIDs.iconDirectory}>Icon directory</label>
          <input
            required
            className="input"
            type="text"
            id={InputIDs.iconDirectory}
            onChange={(e) => {
              savePersistentValue(InputIDs.iconDirectory, e.target.value);
              handleInputChange();
            }}
          />
          <label htmlFor={InputIDs.commitMessage}>Commit message</label>
          <textarea
            required
            className="textarea"
            id={InputIDs.commitMessage}
            onChange={() => handleInputChange()}
          />
        </form>
      </CommonLayout.Content>
      <CommonLayout.Bottom>
        <button
          className="button button--primary"
          style={{ flex: 1 }}
          type="submit"
          form="export"
          disabled={isCreatingPR || !isFormValid}
        >
          Export
        </button>
      </CommonLayout.Bottom>
    </CommonLayout>
  );
};
