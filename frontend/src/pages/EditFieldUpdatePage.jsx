import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fieldService } from '../services/fieldService';
import { useAuthStore } from '../stores/authStore';
import { FiArrowLeft, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const fieldUpdateSchema = z.object({
  notes: z.string().optional(),
  fieldStage: z.enum(['planted', 'growing', 'ready', 'harvested'], {
    errorMap: () => ({ message: 'Please select a valid stage' }),
  }),
});

export function EditFieldUpdatePage() {
  const { fieldId, updateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [update, setUpdate] = useState(null);
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    reset,
  } = useForm({
    resolver: zodResolver(fieldUpdateSchema),
  });

  useEffect(() => {
    fetchUpdateAndField();
  }, [fieldId, updateId]);

  const fetchUpdateAndField = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching update:', updateId, 'for field:', fieldId);
      
      const [fieldRes, updatesRes] = await Promise.all([
        fieldService.getFieldById(fieldId),
        fieldService.getFieldUpdates(fieldId),
      ]);
      
      const fieldData = fieldRes.data;
      const updates = updatesRes.data || [];
      const currentUpdate = updates.find(u => u.id === parseInt(updateId));
      
      if (!currentUpdate) {
        setError('Update not found');
        return;
      }
      
      console.log('Current update:', currentUpdate);
      
      // Check if user is the author
      if (currentUpdate.agentId !== user?.id) {
        setError('Only the author can edit this update');
        return;
      }
      
      setField(fieldData);
      setUpdate(currentUpdate);
      
      // Populate form with existing data
      reset({
        notes: currentUpdate.notes || '',
        fieldStage: currentUpdate.fieldStage,
      });
    } catch (err) {
      console.error('Error fetching update:', err);
      setError(err.response?.data?.message || 'Failed to fetch update');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log('Updating field update with data:', data);
      
      await fieldService.updateFieldUpdate(fieldId, updateId, data);
      console.log('Update successful');
      toast.success('Update edited successfully!');
      
      // Redirect back to field details
      navigate(`/fields/${fieldId}`);
    } catch (err) {
      console.error('Error updating field update:', err);
      const message = err.response?.data?.message || 'Failed to update';
      toast.error(message);
      setFormError('fieldStage', { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !update || !field) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{error || 'Update not found'}</p>
        <button
          onClick={() => navigate(`/fields/${fieldId}`)}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Back to Field Details
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="w-full max-w-3xl px-4 sm:px-0">
        <button
          onClick={() => navigate(`/fields/${fieldId}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Field Details
        </button>

        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Update for {field.field.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">Crop Type: {field.field.cropType}</p>
            <p className="text-gray-600 text-sm sm:text-base">Updated by: <span className="font-semibold">{update.agent?.username}</span></p>
            <p className="text-gray-600 text-sm sm:text-base">Created at: {new Date(update.createdAt).toLocaleString()}</p>
          </div>

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

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-base"
            >
              {isSubmitting ? 'Saving...' : 'Save Update'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/fields/${fieldId}`)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 text-base"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
