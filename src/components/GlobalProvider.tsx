import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { SVGCode, TSXCode } from "../type";
import { POST_MESSAGE_TYPE } from "../consts";

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
    const svgCodesHandler = (event: MessageEvent<{pluginMessage: {type: string, data: any}}>) => {

      if(event.data.pluginMessage.type===POST_MESSAGE_TYPE.LOAD_SVG){
        const svgCodes = event.data.pluginMessage.data as SVGCode[];
        setSvgCodes(svgCodes);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener('message', svgCodesHandler);

    

    return () => {
      window.removeEventListener('message', svgCodesHandler);
    };
  },[]);

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
