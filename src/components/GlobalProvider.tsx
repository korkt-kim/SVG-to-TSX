import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { SVGCode, TSXCode } from "../type";

type STEPS = "inspect" | "export";

export const GlobalContext = createContext<{
  svgCodes: SVGCode[];
  step: STEPS;
  proceedStep: () => void;
  tsxCodes: TSXCode[];
  setTsxCodes: (codes: TSXCode[]) => void;
} | null>(null);

export const GlobalProvider = ({
  children,
}: {
  children: ReactNode | ((step: STEPS) => ReactNode);
}) => {
  const [step, setStep] = useState<STEPS>("inspect");
  const [tsxCodes, setTsxCodes] = useState<TSXCode[]>([]);
  const [svgCodes, setSvgCodes] = useState<SVGCode[]>([]);

  const proceedStep = useCallback(() => {
    setStep((prevStep) => (prevStep === "inspect" ? "export" : "inspect"));
  }, []);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageHandler = (event: MessageEvent<any>) => {
      const svgCodes = event.data.pluginMessage.data as SVGCode[];
      console.log(svgCodes);
      setSvgCodes(svgCodes);
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  });

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
