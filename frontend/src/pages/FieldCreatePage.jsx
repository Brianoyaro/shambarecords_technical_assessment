import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fieldService } from '../services/fieldService';
import { userService } from '../services/userService';
import { FieldForm } from '../components/FieldForm';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

export function FieldCreatePage() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      console.log('All users response:', response.data);
      // Filter for non-admin users (agents) that are active
      const agentUsers = response.data?.filter((u) => u.role !== 'admin' && u.status === 'active') || [];
      console.log('Filtered agents:', agentUsers);
      setAgents(agentUsers);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err.response?.data?.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await fieldService.createField(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create field');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Field</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && (
          <FieldForm
            agents={agents}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
