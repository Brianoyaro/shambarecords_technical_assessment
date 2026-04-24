import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fieldService } from '../services/fieldService';
import { useAuthStore } from '../stores/authStore';
import { FiArrowLeft, FiLoader, FiAlertCircle, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export function FieldDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [field, setField] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFieldDetails();
  }, [id]);

  const fetchFieldDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fieldRes, updatesRes] = await Promise.all([
        fieldService.getFieldById(id),
        fieldService.getFieldUpdates(id),
      ]);
      console.log('Fetched field details:', fieldRes.data);
      console.log('Fetched field updates:', updatesRes.data);
      setField(fieldRes.data);
      setUpdates(updatesRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch field details');
    } finally {
      setLoading(false);
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

  // Check if user can add updates (agent or admin)
  const canAddUpdate = user?.role === 'user' || user?.role === 'admin';

  const handleDeleteUpdate = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) {
      return;
    }
    
    try {
      console.log('Deleting update:', updateId);
      await fieldService.deleteFieldUpdate(id, updateId);
      console.log('Update deleted successfully');
      // Refresh the updates list
      fetchFieldDetails();
    } catch (err) {
      console.error('Error deleting update:', err);
      alert(err.response?.data?.message || 'Failed to delete update');
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Field Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{field.field.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Crop Type</p>
            <p className="text-lg font-semibold text-gray-900">{field.field.cropType}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Location</p>
            <p className="text-lg font-semibold text-gray-900">{field.field.location}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Size (acres)</p>
            <p className="text-lg font-semibold text-gray-900">{field.field.size}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Planting Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(field.field.plantingDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Current Stage</p>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                field.field.currentStage === 'planted'
                  ? 'bg-green-100 text-green-800'
                  : field.field.currentStage === 'growing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : field.field.currentStage === 'ready'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-purple-100 text-purple-800'
              }`}
            >
              {field.field.currentStage}
            </span>
          </div>

          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Assigned Agent</p>
            <p className="text-lg font-semibold text-gray-900">
              {field.field.assignedAgent?.username || 'Unassigned'}
            </p>
          </div>
        </div>
      </div>

      {/* Updates Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Field Updates</h2>
          {canAddUpdate && (
            <button
              onClick={() => navigate(`/fields/${id}/add-update`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              <FiPlus className="w-4 h-4" />
              Add Update
            </button>
          )}
        </div>

        {updates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No updates recorded yet</p>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => {
              const isAuthor = user?.id === update.agentId;
              return (
                <div key={update.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        By {update.agent?.username || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(update.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          update.fieldStage === 'planted'
                            ? 'bg-green-100 text-green-800'
                            : update.fieldStage === 'growing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : update.fieldStage === 'ready'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {update.fieldStage}
                      </span>
                      {isAuthor && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/fields/${id}/updates/${update.id}/edit`)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit update"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUpdate(update.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete update"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {update.notes && <p className="text-gray-700 text-sm">{update.notes}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
