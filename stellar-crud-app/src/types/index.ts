export interface Record {
  id: number;
  name: string;
  description: string;
  value: bigint;
  owner: string;
  created_at: bigint;
  updated_at: bigint;
}

export interface CreateRecordInput {
  name: string;
  description: string;
  value: number;
}

export interface UpdateRecordInput {
  id: number;
  name: string;
  description: string;
  value: number;
}

export interface FreighterApi {
  isConnected(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  signTransaction(
    transaction: string,
    opts?: {
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ): Promise<string>;
}

declare global {
  interface Window {
    freighterApi?: FreighterApi;
  }
}

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export interface RecordsState {
  records: Record[];
  loading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  createRecord: (data: CreateRecordInput) => Promise<void>;
  updateRecord: (data: UpdateRecordInput) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  clearError: () => void;
}
