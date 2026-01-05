export type SetRequired<T, K extends keyof T> = Omit<T,K> & { [P in K]-?: T[P] };
export type SVGCode = {
    name: string;
    svg: string;
}

export type TSXCode = {
    name: string;
    tsx: string;
}