import { useState } from 'react';
import { Edit, Trash2, User, Calendar, DollarSign } from 'lucide-react';
import { Record } from '@/types';
import { useDeleteRecord } from '@/hooks';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface RecordCardProps {
  record: Record;
  onEdit: (record: Record) => void;
  isOwner: boolean;
}

export const RecordCard = ({ record, onEdit, isOwner }: RecordCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { handleDelete } = useDeleteRecord();

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const confirmDelete = async () => {
    await handleDelete(record.id, record.name);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {record.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {record.description}
            </p>
          </div>
          
          {isOwner && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(record)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar registro"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar registro"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="text-xl font-bold text-green-700">
            {record.value.toString()}
          </span>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Propietario: {formatAddress(record.owner)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Creado: {formatDate(record.created_at)}</span>
          </div>
          
          {record.created_at !== record.updated_at && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Actualizado: {formatDate(record.updated_at)}</span>
            </div>
          )}
        </div>

        {/* Owner badge */}
        {isOwner && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Tu registro
            </span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          recordName={record.name}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};
