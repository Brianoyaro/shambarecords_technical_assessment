import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fieldService } from '../services/fieldService';
import { FieldUpdateForm } from '../components/FieldUpdateForm';
import { FiArrowLeft, FiLoader, FiAlertCircle } from 'react-icons/fi';

export function FieldUpdatePage() {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchField();
  }, [fieldId]);

  const fetchField = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching field with id:', fieldId);
      const response = await fieldService.getFieldById(fieldId);
      console.log('Field fetched:', response.data);
      setField(response.data);
    } catch (err) {
      console.error('Error fetching field:', err);
      setError(err.response?.data?.message || 'Failed to fetch field');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    console.log('Update successful, redirecting to field details');
    navigate(`/fields/${fieldId}`);
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
    <div>
      <button
        onClick={() => navigate(`/fields/${fieldId}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Field Details
      </button>

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Update for {field.field.name}</h1>
          <p className="text-gray-600">Crop Type: {field.field.cropType}</p>
          <p className="text-gray-600">Current Stage: <span className="font-semibold">{field.field.currentStage}</span></p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <FieldUpdateForm fieldId={fieldId} onSuccess={handleUpdateSuccess} />
      </div>
    </div>
  );
}
