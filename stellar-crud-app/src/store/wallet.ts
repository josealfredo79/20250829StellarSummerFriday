import { create } from 'zustand';
import { WalletState } from '@/types';

interface WalletStore extends WalletState {}

export const useWalletStore = create<WalletStore>((set, get) => ({
  isConnected: false,
  publicKey: null,

  connect: async () => {
    try {
      // Esperar a que Freighter esté disponible
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!window.freighterApi && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      // Verificar si Freighter está disponible
      if (!window.freighterApi) {
        throw new Error('Freighter wallet no está instalado. Por favor instala la extensión Freighter y recarga la página.');
      }

      // Verificar si ya está conectado
      const isConnected = await window.freighterApi.isConnected();
      if (!isConnected) {
        throw new Error('Por favor conecta tu wallet Freighter primero.');
      }

      // Obtener la clave pública
      const publicKey = await window.freighterApi.getPublicKey();
      
      set({
        isConnected: true,
        publicKey,
      });

      // Guardar en localStorage para persistencia
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_publicKey', publicKey);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  },

  disconnect: () => {
    set({
      isConnected: false,
      publicKey: null,
    });

    // Limpiar localStorage
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_publicKey');
  },
}));

// Hook para inicializar la conexión desde localStorage
export const initializeWallet = async () => {
  // Esperar a que la ventana esté completamente cargada
  if (typeof window === 'undefined') return;
  
  const isConnected = localStorage.getItem('wallet_connected') === 'true';
  const publicKey = localStorage.getItem('wallet_publicKey');

  if (isConnected && publicKey) {
    // Esperar a que Freighter esté disponible
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos máximo
    
    while (!window.freighterApi && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (window.freighterApi) {
      try {
        // Verificar que la wallet siga conectada
        const connected = await window.freighterApi.isConnected();
        if (connected) {
          useWalletStore.setState({
            isConnected: true,
            publicKey,
          });
        } else {
          // Si no está conectada, limpiar el estado
          useWalletStore.getState().disconnect();
        }
      } catch (error) {
        console.warn('Error checking wallet connection:', error);
        useWalletStore.getState().disconnect();
      }
    }
  }
};
