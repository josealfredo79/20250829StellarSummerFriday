'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { WalletConnector, RecordList } from '@/components';
import { initializeWallet } from '@/store';

export default function Home() {
  useEffect(() => {
    // Inicializar wallet desde localStorage después de que el componente se monte
    const init = async () => {
      // Esperar a que la página esté completamente cargada
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Esperar un poco más para asegurar que las extensiones estén cargadas
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        await initializeWallet();
      } catch (error) {
        console.log('Error initializing wallet:', error);
      }
    };
    init();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Stellar CRUD
              </h1>
              <p className="text-gray-600 text-sm">
                Gestiona registros en la blockchain de Stellar
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Testnet
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Wallet Connection */}
          <WalletConnector />
          
          {/* Records Management */}
          <RecordList />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>
              Aplicación CRUD en Stellar Soroban • Contrato:{' '}
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                CDGZVMBSHNJ4JYESI32MUANDBNW5NM2ASUY6FOONND3WHJYPNYMV6BNJ
              </code>
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </main>
  );
}
