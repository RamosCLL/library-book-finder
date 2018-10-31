/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module 'defiant.js' {
  export function Defiant(window, undefined);
}