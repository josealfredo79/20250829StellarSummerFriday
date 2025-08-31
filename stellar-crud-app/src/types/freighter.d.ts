declare global {
  interface Window {
    freighterApi?: {
      isConnected(): Promise<boolean>;
      getPublicKey(): Promise<string>;
      signTransaction(xdr: string, network?: string): Promise<string>;
      getNetwork(): Promise<string>;
      requestAccess(): Promise<void>;
      isAllowed(): Promise<boolean>;
    };
    freighter?: any;
    FreighterApi?: any;
  }
}

export {};
