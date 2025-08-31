'use client';

import { useState, useEffect } from 'react';
import { Wallet, ExternalLink, AlertCircle, LogOut, Loader2 } from 'lucide-react';
import { isConnected } from '@stellar/freighter-api';
import { useWalletStore } from '@/store';
import { useNotifications } from '@/hooks';

export default function WalletConnector() {
  const { isConnected: walletConnected, publicKey, connect, disconnect, isConnecting, error } = useWalletStore();
  const { showSuccess, showError } = useNotifications();
  const [freighterDetected, setFreighterDetected] = useState<boolean | null>(null);

  // Detectar Freighter al cargar el componente
  useEffect(() => {
    const detectFreighter = async () => {
      try {
        const connectionCheck = await isConnected();
        setFreighterDetected(!connectionCheck.error);
      } catch (error) {
        setFreighterDetected(false);
      }
    };
    
    detectFreighter();
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
      showSuccess('¡Wallet conectada exitosamente!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error conectando wallet';
      showError(errorMessage);
      
      // Si es error de Freighter no instalado, mostrar instrucciones
      if (errorMessage.includes('no está instalado')) {
        setTimeout(() => {
          showError('Instala Freighter desde: https://freighter.app/ y luego recarga la página');
        }, 2000);
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    showSuccess('Wallet desconectada');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!walletConnected) {
    // Mostrar estado de carga mientras detectamos Freighter
    if (freighterDetected === null) {
      return (
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Detectando Freighter...</span>
          </div>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Verificando si tienes la extensión Freighter instalada...
          </p>
        </div>
      );
    }

    // Mostrar mensaje si Freighter no está instalado
    if (freighterDetected === false) {
      return (
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>Freighter no detectado</span>
          </div>
          
          <a
            href="https://freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Instalar Freighter
          </a>
          
          <p className="text-sm text-red-600 text-center max-w-md">
            Necesitas instalar la extensión Freighter para usar esta aplicación. Después de instalarla, recarga la página.
          </p>
        </div>
      );
    }

    // Freighter detectado, mostrar botón de conexión
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="flex items-center gap-2 text-gray-600">
          <AlertCircle className="w-5 h-5" />
          <span>Wallet no conectada</span>
        </div>
        
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Wallet className="w-5 h-5" />
          {isConnecting ? 'Conectando...' : 'Conectar Freighter'}
        </button>
        
        {error && (
          <p className="text-sm text-red-600 text-center max-w-md">
            {error}
          </p>
        )}
        
        <p className="text-sm text-gray-500 text-center max-w-md">
          Necesitas conectar tu wallet Freighter para crear y gestionar registros en la blockchain de Stellar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div>
          <p className="text-sm font-medium text-green-800">Wallet Conectada</p>
          <p className="text-sm text-green-600 font-mono">
            {formatAddress(publicKey || '')}
          </p>
        </div>
      </div>
      
      <button
        onClick={handleDisconnect}
        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Desconectar
      </button>
    </div>
  );
};
