import { POST_MESSAGE_TYPE } from "./consts";

export type SetRequired<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P];
};
export type SVGCode = {
  name: string;
  svg: string;
};

export type TSXCode = {
  name: string;
  tsx: string;
};

export type PluginMessage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { type: 'loadAll'; data: Record<string, any> }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { type: 'save'; data: Record<string, any> }
    | { type: 'close'; };

export interface PostMessage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadAll: { type: typeof POST_MESSAGE_TYPE.LOAD_ALL; data: Record<string, any> }
  loadSvg: { type: typeof POST_MESSAGE_TYPE.LOAD_SVG; data: SVGCode[] }
}
    

export type FigmaMessageEvent = MessageEvent<{
  pluginMessage: PluginMessage;
}>;