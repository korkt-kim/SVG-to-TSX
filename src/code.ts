import { debounce } from "./utils/debounce";

// Utility functions start here
function ab2str(buf: Uint8Array) {
  return String.fromCharCode.apply(
    null,
    new Uint16Array(buf) as unknown as number[],
  );
}

function getSelectedComponents() {
  return figma.currentPage.selection.filter(
    (item) => item.type === "COMPONENT",
  );
}

figma.showUI(__html__, { visible: true, width: 500, height: 500 });

Promise.all(
  getSelectedComponents().map((selected) =>
    selected.exportAsync({ format: "SVG" }),
  ),
).then((svgCodes) => {
  figma.ui.postMessage({
    type: "networkRequest",
    data: svgCodes.map((svgCode, index) => ({
      svg: ab2str(svgCode),
      name: getSelectedComponents()[index].name,
    })),
  });
});

figma.on(
  "selectionchange",
  debounce(() => {
    Promise.all(
      getSelectedComponents().map((selected) =>
        selected.exportAsync({ format: "SVG" }),
      ),
    ).then((svgCodes) => {
      figma.ui.postMessage({
        type: "networkRequest",
        data: svgCodes.map((svgCode, index) => ({
          svg: ab2str(svgCode),
          originalName: getSelectedComponents()[index].name,
          name: getSelectedComponents()[index].name,
        })),
      });
    });
  }),
);
