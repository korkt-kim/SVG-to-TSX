import { POST_MESSAGE_TYPE } from "./consts";
import { PluginMessage, PostMessage } from "./type";
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

figma.showUI(__html__, { visible: true, width: 240, height: 270 });

Promise.all(
  getSelectedComponents().map((selected) =>
    selected.exportAsync({ format: "SVG" }),
  ),
).then((svgCodes) => {
  figma.ui.postMessage({
    type: POST_MESSAGE_TYPE.LOAD_SVG,
    data: svgCodes.map((svgCode, index) => ({
      svg: ab2str(svgCode),
      name: getSelectedComponents()[index].name,
    })),
  } satisfies PostMessage["loadSvg"]);
});

figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case "loadAll": {
      const keys = await figma.clientStorage.keysAsync();

      const dataPairs = await Promise.all(
        keys.map(async (key) => {
          const value = await figma.clientStorage.getAsync(key);
          return { [key]: value };
        }),
      );

      figma.ui.postMessage({
        type: POST_MESSAGE_TYPE.LOAD_ALL,
        data: Object.assign({}, ...dataPairs),
      } satisfies PostMessage["loadAll"]);

      return;
    }

    case "save": {
      const data = Object.fromEntries(
        Object.entries(msg).filter(([key]) => key !== "type"),
      );

      Object.entries(data).forEach(([key, value]) => {
        figma.clientStorage.setAsync(key, value);
      });

      return;
    }

    case "close": {
      figma.closePlugin();
    }
  }
};

figma.on(
  "selectionchange",
  debounce(() => {
    Promise.all(
      getSelectedComponents().map((selected) =>
        selected.exportAsync({ format: "SVG" }),
      ),
    ).then((svgCodes) => {
      figma.ui.postMessage({
        type: POST_MESSAGE_TYPE.LOAD_SVG,
        data: svgCodes.map((svgCode, index) => ({
          svg: ab2str(svgCode),
          originalName: getSelectedComponents()[index].name,
          name: getSelectedComponents()[index].name,
        })),
      } satisfies PostMessage["loadSvg"]);
    });
  }),
);
