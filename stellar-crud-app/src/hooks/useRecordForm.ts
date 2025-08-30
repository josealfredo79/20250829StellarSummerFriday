import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateRecordInput, UpdateRecordInput } from '@/types';
import { useRecordsStore } from '@/store';
import { useNotifications } from './useNotifications';

// Schemas de validación
const createRecordSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  description: z.string()
    .min(1, 'La descripción es requerida')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  value: z.number()
    .min(0, 'El valor debe ser positivo')
    .max(999999999, 'El valor es demasiado grande'),
});

const updateRecordSchema = createRecordSchema.extend({
  id: z.number().min(1, 'ID inválido'),
});

export const useRecordForm = (mode: 'create' | 'update', initialData?: UpdateRecordInput) => {
  const { createRecord, updateRecord } = useRecordsStore();
  const { showSuccess, showError, showLoading, dismissToast } = useNotifications();

  const form = useForm<CreateRecordInput | UpdateRecordInput>({
    resolver: zodResolver(mode === 'create' ? createRecordSchema : updateRecordSchema),
    defaultValues: mode === 'create' 
      ? { name: '', description: '', value: 0 }
      : initialData,
  });

  const onSubmit = async (data: CreateRecordInput | UpdateRecordInput) => {
    const loadingToast = showLoading(
      mode === 'create' ? 'Creando registro...' : 'Actualizando registro...'
    );

    try {
      if (mode === 'create') {
        await createRecord(data as CreateRecordInput);
        showSuccess('¡Registro creado exitosamente!');
        form.reset();
      } else {
        await updateRecord(data as UpdateRecordInput);
        showSuccess('¡Registro actualizado exitosamente!');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      dismissToast(loadingToast);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
};

export const useDeleteRecord = () => {
  const { deleteRecord } = useRecordsStore();
  const { showSuccess, showError, showLoading, dismissToast } = useNotifications();

  const handleDelete = async (id: number, name: string) => {
    const loadingToast = showLoading(`Eliminando "${name}"...`);

    try {
      await deleteRecord(id);
      showSuccess(`¡Registro "${name}" eliminado exitosamente!`);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error eliminando registro');
    } finally {
      dismissToast(loadingToast);
    }
  };

  return { handleDelete };
};
