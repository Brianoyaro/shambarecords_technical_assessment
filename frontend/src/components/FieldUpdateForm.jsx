import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { fieldService } from '../services/fieldService';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const fieldUpdateSchema = z.object({
  notes: z.string().optional(),
  fieldStage: z.enum(['planted', 'growing', 'ready', 'harvested'], {
    errorMap: () => ({ message: 'Please select a valid stage' }),
  }),
});

export function FieldUpdateForm({ fieldId, onSuccess }) {
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(fieldUpdateSchema),
  });
  
  console.log('FieldUpdateForm rendered with fieldId:', fieldId, 'isSubmitting:', isSubmitting);

  const onSubmit = async (data) => {
    try {
      console.log('FieldUpdateForm onSubmit called with data:', data);
      console.log('fieldId:', fieldId);
      const response = await fieldService.createFieldUpdate(fieldId, data);
      console.log('createFieldUpdate response:', response);
      toast.success('Update added successfully!');
      reset();
      setTimeout(() => {
        console.log('Calling onSuccess callback');
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error creating field update:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to add update';
      toast.error(message);
      setError('fieldStage', { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="fieldStage" className="block text-base font-medium text-gray-700 mb-2">
          Field Stage *
        </label>
        <select
          id="fieldStage"
          {...register('fieldStage')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
        >
          <option value="">Select a stage</option>
          <option value="planted">Planted</option>
          <option value="growing">Growing</option>
          <option value="ready">Ready</option>
          <option value="harvested">Harvested</option>
        </select>
        {errors.fieldStage && (
          <p className="mt-2 text-sm text-red-600">{errors.fieldStage.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-base font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          rows="6"
          placeholder="Add any notes or observations about the field..."
        />
        {errors.notes && <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-base"
      >
        {isSubmitting ? 'Adding Update...' : 'Add Update'}
      </button>
    </form>
  );
}
