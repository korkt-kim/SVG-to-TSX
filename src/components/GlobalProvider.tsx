import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { SVGCode, TSXCode } from "../type";
import { POST_MESSAGE_TYPE } from "../consts";

const STEPS = ["inspect", "export", "done"];

type Steps = (typeof STEPS)[number];

export const GlobalContext = createContext<{
  svgCodes: SVGCode[];
  step: Steps;
  proceedStep: () => void;
  tsxCodes: TSXCode[];
  setTsxCodes: (codes: TSXCode[]) => void;
} | null>(null);

export const GlobalProvider = ({
  children,
}: {
  children: ReactNode | ((step: Steps) => ReactNode);
}) => {
  const [step, setStep] = useState<Steps>("inspect");
  const [tsxCodes, setTsxCodes] = useState<TSXCode[]>([]);
  const [svgCodes, setSvgCodes] = useState<SVGCode[]>([]);

  const proceedStep = useCallback(() => {
    setStep((prevStep) => STEPS[STEPS.indexOf(prevStep) + 1]);
  }, []);

  useEffect(() => {
    if (svgCodes.length === 0 && step === "export") {
      setStep("inspect");
    }
  }, [step, svgCodes]);

  useLayoutEffect(() => {
    const svgCodesHandler = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      event: MessageEvent<{ pluginMessage: { type: string; data: any } }>,
    ) => {
      if (event.data.pluginMessage.type === POST_MESSAGE_TYPE.LOAD_SVG) {
        const svgCodes = event.data.pluginMessage.data as SVGCode[];
        setSvgCodes(svgCodes);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener("message", svgCodesHandler);

    return () => {
      window.removeEventListener("message", svgCodesHandler);
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{ svgCodes, step, proceedStep, tsxCodes, setTsxCodes }}
    >
      {typeof children === "function" ? children(step) : children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
