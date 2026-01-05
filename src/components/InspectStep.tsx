import { useRef } from "react";
import { useGlobalContext } from "./GlobalProvider";
import { SVGR } from "../utils/svgr";
import { TSXCode } from "../type";

export const InspectStep = () => {
  const globalContext = useGlobalContext();
  const svgrRef = useRef<SVGR | null>(null);

  if (!svgrRef.current) {
    svgrRef.current = new SVGR();
  }

  return (
    <div>
      {globalContext?.svgCodes.map((svg, index) => (
        <SVGItem key={index} name={svg.name} />
      ))}

      <button
        onClick={async () => {
          const tsxCodes = await Promise.all(
            globalContext?.svgCodes.map((svg) => {
              return new Promise<TSXCode>((resolve) => {
                if (!svgrRef.current) {
                  throw new Error("SVGR is not initialized");
                }
                svgrRef.current.convertToTSX(svg).then((tsx) => {
                  resolve({ tsx, name: svg.name });
                });
              });
            }),
          );

          globalContext.setTsxCodes(tsxCodes);

          globalContext.proceedStep();
        }}
      >
        Convert and Export
      </button>
    </div>
  );
};

const SVGItem = ({ name }: { name: string }) => {
  return <div>{name}</div>;
};
