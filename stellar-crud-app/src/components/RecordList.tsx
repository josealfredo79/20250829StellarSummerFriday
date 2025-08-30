import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Database } from 'lucide-react';
import { useRecordsStore, useWalletStore } from '@/store';
import { RecordCard } from './RecordCard';
import { RecordForm } from './RecordForm';
import { Record, UpdateRecordInput } from '@/types';

export const RecordList = () => {
  const { records, loading, error, fetchRecords, clearError } = useRecordsStore();
  const { publicKey, isConnected } = useWalletStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine'>('all');

  useEffect(() => {
    if (isConnected) {
      fetchRecords();
    }
  }, [isConnected, fetchRecords]);

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'mine' && record.owner === publicKey);
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (record: Record) => {
    setEditingRecord(record);
  };

  const handleCloseEdit = () => {
    setEditingRecord(null);
  };

  const convertToUpdateInput = (record: Record): UpdateRecordInput => ({
    id: record.id,
    name: record.name,
    description: record.description,
    value: Number(record.value),
  });

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Conecta tu wallet
        </h3>
        <p className="text-gray-600">
          Necesitas conectar tu wallet para ver y gestionar registros
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registros</h2>
          <p className="text-gray-600">
            {filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''} encontrado{filteredRecords.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchRecords}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Registro
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'mine'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Mis Registros
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <p className="text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Cargando registros...</span>
          </div>
        </div>
      )}

      {/* Records Grid */}
      {!loading && filteredRecords.length === 0 ? (
        <div className="text-center py-12">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filter === 'mine' ? 'No se encontraron registros' : 'No hay registros'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda'
              : filter === 'mine'
              ? 'Aún no has creado ningún registro'
              : 'Sé el primero en crear un registro'
            }
          </p>
          {(!searchTerm && filter !== 'mine') && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Primer Registro
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onEdit={handleEdit}
              isOwner={record.owner === publicKey}
            />
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <RecordForm
          mode="create"
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Form Modal */}
      {editingRecord && (
        <RecordForm
          mode="update"
          initialData={convertToUpdateInput(editingRecord)}
          onClose={handleCloseEdit}
          onSuccess={handleCloseEdit}
        />
      )}
    </div>
  );
};
