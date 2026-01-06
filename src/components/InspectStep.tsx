import { useRef } from "react";
import { useGlobalContext } from "./GlobalProvider";
import { SVGR } from "../utils/svgr";
import { TSXCode } from "../type";
import { CommonLayout } from "../layouts/CommonLayout";

export const InspectStep = () => {
  const globalContext = useGlobalContext();
  const svgrRef = useRef<SVGR | null>(null);

  if (!svgrRef.current) {
    svgrRef.current = new SVGR();
  }

  const isSvgComponentSelected = globalContext.svgCodes.length > 0;

  return (
    <CommonLayout>
      <CommonLayout.Content>
        {isSvgComponentSelected ? (
          globalContext?.svgCodes.map((svg, index) => (
            <SVGItem key={index} name={svg.name} />
          ))
        ) : (
          <>
            <p>No Component(or Instance) icons are selected.</p>
            <a
              target="_blank"
              href="https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma"
            >
              What are Components and Instances?
            </a>
          </>
        )}
      </CommonLayout.Content>
      <CommonLayout.Bottom>
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
      </CommonLayout.Bottom>
    </CommonLayout>
  );
};

const SVGItem = ({ name }: { name: string }) => {
  return <div>{name}</div>;
};
