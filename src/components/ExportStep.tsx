import { useEffect, useMemo, useRef, useState } from "react";
import { CodeHosting } from "../utils/codeHosting/codeHosting";
import { useGlobalContext } from "./GlobalProvider";
import { GitHub } from "../utils/codeHosting/github";
import { useFigmaPersistentValue } from "../libs/FigmaPersistentValue";
import { CommonLayout } from "../layouts/CommonLayout";
import { GitLab } from "../utils/codeHosting/gitlab";



const CODE_HOSTING_SELECT_OPTIONS = [
  { value: "github", label: "GitHub" },
  { value: "gitlab", label: "GitLab" },
  { value: "bitbucket", label: "Bitbucket" },
] as const;

export const ExportStep = () => {
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const globalContext = useGlobalContext();
  const [alertMessage, setAlert] = useState("");

  const codeHostingRef = useRef<CodeHosting | null>(null);
  const { value, savePersistentValue } = useFigmaPersistentValue();
  const [formValues, setFormValues] = useState<{
    codeHosting: typeof CODE_HOSTING_SELECT_OPTIONS[number]['value'];
    accessToken: string;
    repoUrl: string;
    featureBranch: string;
    iconDirectory: string;
    commitMessage: string;
  }>({
    codeHosting: CODE_HOSTING_SELECT_OPTIONS[0].value,
    accessToken: "",
    repoUrl: "",
    featureBranch: "",
    iconDirectory: "",
    commitMessage: "",
  })
  const InputIDs= (Object.keys(formValues) as (keyof typeof formValues)[]).reduce<Record<string, string>>((acc,item)=> ({
    ...acc,
    [item]:item
  }), {}) as Record<keyof typeof formValues, keyof typeof formValues>;

  const setFormValue = (key: keyof typeof formValues, value: typeof formValues[keyof typeof formValues]) => {
    savePersistentValue(key, value);
    setFormValues(prev=> ({
      ...prev,
      [key]: value,
    }));
  }



  useEffect(() => {
    setFormValues(prev=> {
      (Object.keys(prev) as (keyof typeof formValues)[]).forEach(key=>{
        prev[key] = value[key] || "";
      })
      
      return {...prev};
    })
  }, []);

  useEffect(()=>{
    switch (formValues.codeHosting) {
      case 'github':
        codeHostingRef.current = new GitHub();
        break;
      case "gitlab":
        codeHostingRef.current = new GitLab();
        break;
      // case "bitbucket":
      //   codeHostingRef.current = new Bitbucket();
      //   break;
    }
  },[formValues.codeHosting])

  const isFormValid = useMemo(()=> formValues.accessToken && formValues.repoUrl && formValues.featureBranch && formValues.iconDirectory && formValues.commitMessage,[formValues])

  return (
    <CommonLayout>
      <CommonLayout.Alert message={alertMessage} />
      <CommonLayout.Content>
        <form
          id="export"
          className="form form--vertical"
          onSubmit={async (e) => {
            e.preventDefault();
            setAlert("");
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
                setAlert(e.message);
              }
            } finally {
              setIsCreatingPR(false);
            }
          }}
        >
          <label htmlFor={InputIDs.codeHosting}>Code Hosting</label>
          <select
            required
            className="input"
            id={InputIDs.codeHosting}
            value={formValues.codeHosting}
            onChange={(e) => {
              setFormValue(InputIDs.codeHosting, e.target.value);
            }}
          >
            {CODE_HOSTING_SELECT_OPTIONS.map(item=>(
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <label htmlFor={InputIDs.accessToken}>Access Token</label>
          <input
            required
            className="input"
            type="password"
            value={formValues.accessToken}
            id={InputIDs.accessToken}
            onChange={(e) => {
              setFormValue(InputIDs.accessToken, e.target.value);
            }}
          />
          <label htmlFor={InputIDs.repoUrl}>repo url</label>
          <input
            required
            className="input"
            type="text"
            value={formValues.repoUrl}
            id={InputIDs.repoUrl}
            onChange={(e) => {
              setFormValue(InputIDs.repoUrl, e.target.value);
            }}
          />
          <label htmlFor={InputIDs.featureBranch}>Feature branch</label>
          <input
            required
            className="input"
            type="text"
            value={formValues.featureBranch}
            id={InputIDs.featureBranch}
            onChange={(e) => {
              setFormValue(InputIDs.featureBranch, e.target.value);
            }}
          />
          <label htmlFor={InputIDs.iconDirectory}>Icon directory</label>
          <input
            required
            className="input"
            type="text"
            value={formValues.iconDirectory}
            id={InputIDs.iconDirectory}
            onChange={(e) => {
              setFormValue(InputIDs.iconDirectory, e.target.value);
            }}
          />
          <label htmlFor={InputIDs.commitMessage}>Commit message</label>
          <textarea
            required
            className="textarea"
            value={formValues.commitMessage}
            id={InputIDs.commitMessage}
            onChange={(e) => {
              setFormValue(InputIDs.commitMessage, e.target.value);
            }}
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
