import { useState } from 'react';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';
import { useWalletStore } from '@/store';
import { useNotifications } from '@/hooks';

export const WalletConnector = () => {
  const { isConnected, publicKey, connect, disconnect } = useWalletStore();
  const { showError, showSuccess } = useNotifications();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
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
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    showSuccess('Wallet desconectada');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
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
