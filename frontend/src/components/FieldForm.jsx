import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiX, FiAlertCircle } from 'react-icons/fi';

const fieldSchema = z.object({
  name: z.string().min(2, 'Field name must be at least 2 characters'),
  cropType: z.string().min(2, 'Crop type must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  size: z.coerce.number().positive('Size must be greater than 0'),
  plantingDate: z.string().min(1, 'Planting date is required'),
  assignedAgentId: z.coerce.number().nullable().optional(),
});

export function FieldForm({ field, onSubmit, onCancel, isLoading, agents = [] }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: field || {
      name: '',
      cropType: '',
      location: '',
      size: '',
      plantingDate: '',
      assignedAgentId: '',
    },
  });

  const handleFormSubmit = (data) => {
    const cleanData = {
      ...data,
      assignedAgentId: data.assignedAgentId ? parseInt(data.assignedAgentId) : null,
    };
    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Field Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Field Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., North Field"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Crop Type */}
      <div>
        <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
          Crop Type
        </label>
        <input
          id="cropType"
          type="text"
          {...register('cropType')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Maize, Beans, Tomato"
        />
        {errors.cropType && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.cropType.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          id="location"
          type="text"
          {...register('location')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Nairobi, Kiambu County"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.location.message}
          </p>
        )}
      </div>

      {/* Size */}
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
          Size (acres)
        </label>
        <input
          id="size"
          type="number"
          step="0.1"
          {...register('size')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 2.5"
        />
        {errors.size && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.size.message}
          </p>
        )}
      </div>

      {/* Planting Date */}
      <div>
        <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700 mb-1">
          Planting Date
        </label>
        <input
          id="plantingDate"
          type="date"
          {...register('plantingDate')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.plantingDate && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.plantingDate.message}
          </p>
        )}
      </div>

      {/* Assigned Agent */}
      <div>
        <label htmlFor="assignedAgentId" className="block text-sm font-medium text-gray-700 mb-1">
          Assign Agent
        </label>
        <select
          id="assignedAgentId"
          {...register('assignedAgentId')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Select Agent --</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.username} ({agent.email})
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Saving...' : field ? 'Update Field' : 'Create Field'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
