declare module 'commitizen' {
  export const configLoader: {
    load(): Record<string, unknown>;
  };
}
