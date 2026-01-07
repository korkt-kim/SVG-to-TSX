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

export interface PostMessage {
  loadAll: {
    type: typeof POST_MESSAGE_TYPE.LOAD_ALL;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>;
  };
  loadSvg: { type: typeof POST_MESSAGE_TYPE.LOAD_SVG; data: SVGCode[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save: { type: typeof POST_MESSAGE_TYPE.SAVE; data: Record<string, any> };
  close: { type: typeof POST_MESSAGE_TYPE.CLOSE };
}

export type FigmaMessageEvent = MessageEvent<{
  pluginMessage: PostMessage[keyof PostMessage];
}>;
