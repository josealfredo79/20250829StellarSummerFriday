import { create } from 'zustand';
import { RecordsState, Record, CreateRecordInput, UpdateRecordInput } from '@/types';

// Configuración del contrato
const CONTRACT_ID = 'CDGZVMBSHNJ4JYESI32MUANDBNW5NM2ASUY6FOONND3WHJYPNYMV6BNJ';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

interface RecordsStore extends RecordsState {}

export const useRecordsStore = create<RecordsStore>((set, get) => ({
  records: [],
  loading: false,
  error: null,

  fetchRecords: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulamos datos por ahora - implementaremos la llamada real después
      const mockRecords: Record[] = [
        {
          id: 1,
          name: "Registro de Ejemplo",
          description: "Este es un registro de ejemplo",
          value: BigInt(1000),
          owner: "GBXXXXX...",
          created_at: BigInt(Date.now()),
          updated_at: BigInt(Date.now())
        }
      ];
      
      set({ records: mockRecords, loading: false });
    } catch (error) {
      console.error('Error fetching records:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false 
      });
    }
  },

  createRecord: async (data: CreateRecordInput) => {
    const { publicKey, isConnected } = useWalletStore.getState();
    if (!isConnected || !publicKey) {
      throw new Error('Wallet no conectada');
    }

    set({ loading: true, error: null });

    try {
      if (!window.freighterApi) {
        throw new Error('Freighter wallet no encontrada');
      }

      // Por ahora simulamos la creación exitosa
      console.log('Creating record:', data, 'for user:', publicKey);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Agregar el nuevo registro a la lista local
      const newRecord: Record = {
        id: Date.now(), // ID temporal
        name: data.name,
        description: data.description,
        value: BigInt(data.value),
        owner: publicKey,
        created_at: BigInt(Date.now()),
        updated_at: BigInt(Date.now())
      };

      const currentRecords = get().records;
      set({ 
        records: [...currentRecords, newRecord],
        loading: false 
      });

    } catch (error) {
      console.error('Error creating record:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error creando registro',
        loading: false 
      });
      throw error;
    }
  },

  updateRecord: async (data: UpdateRecordInput) => {
    const { publicKey, isConnected } = useWalletStore.getState();
    if (!isConnected || !publicKey) {
      throw new Error('Wallet no conectada');
    }

    set({ loading: true, error: null });

    try {
      if (!window.freighterApi) {
        throw new Error('Freighter wallet no encontrada');
      }

      console.log('Updating record:', data, 'for user:', publicKey);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizar el registro en la lista local
      const currentRecords = get().records;
      const updatedRecords = currentRecords.map(record => 
        record.id === data.id 
          ? {
              ...record,
              name: data.name,
              description: data.description,
              value: BigInt(data.value),
              updated_at: BigInt(Date.now())
            }
          : record
      );

      set({ 
        records: updatedRecords,
        loading: false 
      });

    } catch (error) {
      console.error('Error updating record:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error actualizando registro',
        loading: false 
      });
      throw error;
    }
  },

  deleteRecord: async (id: number) => {
    const { publicKey, isConnected } = useWalletStore.getState();
    if (!isConnected || !publicKey) {
      throw new Error('Wallet no conectada');
    }

    set({ loading: true, error: null });

    try {
      if (!window.freighterApi) {
        throw new Error('Freighter wallet no encontrada');
      }

      console.log('Deleting record:', id, 'for user:', publicKey);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Eliminar el registro de la lista local
      const currentRecords = get().records;
      const filteredRecords = currentRecords.filter(record => record.id !== id);

      set({ 
        records: filteredRecords,
        loading: false 
      });

    } catch (error) {
      console.error('Error deleting record:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error eliminando registro',
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Importar el store de wallet
import { useWalletStore } from './wallet';
