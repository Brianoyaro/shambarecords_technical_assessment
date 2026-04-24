import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fieldService } from '../services/fieldService';
import { userService } from '../services/userService';
import { FieldForm } from '../components/FieldForm';
import { FiArrowLeft, FiAlertCircle, FiLoader } from 'react-icons/fi';

export function FieldEditPage() {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [field, setField] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fieldId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fieldRes, agentsRes] = await Promise.all([
        fieldService.getFieldById(fieldId),
        userService.getAllUsers(),
      ]);
      setField(fieldRes.data);
      console.log('All users response:', agentsRes.data);
      // Filter for non-admin users (agents) that are active
      const agentUsers = agentsRes.data?.filter((u) => u.role !== 'admin' && u.status === 'active') || [];
      console.log('Filtered agents:', agentUsers);
      setAgents(agentUsers);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load field');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await fieldService.updateField(fieldId, data);
      toast.success('Field updated successfully!');
      navigate(`/fields/${fieldId}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update field';
      toast.error(message);
      setError(message);
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

  if (!field || !field.field) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{error || 'Field not found'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(`/fields/${fieldId}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Field Details
      </button>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Field: {field.field.name}</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <FieldForm
          field={{
            name: field.field.name,
            cropType: field.field.cropType,
            location: field.field.location,
            size: field.field.size,
            plantingDate: field.field.plantingDate.split('T')[0], // Format date for input
            assignedAgentId: field.field.assignedAgent?.id || '',
          }}
          agents={agents}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/fields/${fieldId}`)}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
