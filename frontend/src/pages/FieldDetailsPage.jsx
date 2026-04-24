import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fieldService } from '../services/fieldService';
import { useAuthStore } from '../stores/authStore';
import { FiArrowLeft, FiLoader, FiAlertCircle, FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUser, FiCheckCircle, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';

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

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
      case 'at_risk':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
      case 'completed':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  // Helper function to get risk level icon and color
  const getRiskLevelIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return { icon: FiAlertTriangle, color: 'text-red-600', bg: 'bg-red-100' };
      case 'medium':
        return { icon: FiAlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'low':
        return { icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      default:
        return { icon: FiTrendingUp, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  // Helper function to get stage color
  const getStageColor = (stage) => {
    switch (stage) {
      case 'planted':
        return 'bg-green-100 text-green-800';
      case 'growing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-orange-100 text-orange-800';
      case 'harvested':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate expected harvest date (90 days from planting)
  const calculateExpectedHarvestDate = (plantingDate) => {
    const date = new Date(plantingDate);
    date.setDate(date.getDate() + 90);
    return date;
  };

  const handleDeleteUpdate = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) {
      return;
    }
    
    try {
      console.log('Deleting update:', updateId);
      await fieldService.deleteFieldUpdate(id, updateId);
      console.log('Update deleted successfully');
      toast.success('Update deleted successfully!');
      // Refresh the updates list
      fetchFieldDetails();
    } catch (err) {
      console.error('Error deleting update:', err);
      const message = err.response?.data?.message || 'Failed to delete update';
      toast.error(message);
    }
  };

  // Check if user can add updates (agent or admin)
  const canAddUpdate = user?.role === 'user' || user?.role === 'admin';

  // Calculate variables for rendering
  const statusColor = getStatusColor(field.status);
  const riskIcon = getRiskLevelIcon(field.riskLevel);
  const RiskIcon = riskIcon.icon;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Title and Status Overview */}
      <div className={`bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 ${statusColor.border}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{field.field.name}</h1>
            <p className="text-gray-500 text-sm sm:text-base">{field.field.cropType} • {field.field.location}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColor.badge}`}>
              {field.status.charAt(0).toUpperCase() + field.status.slice(1)}
            </span>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${riskIcon.bg}`}>
              <RiskIcon className={`w-4 h-4 ${riskIcon.color}`} />
              <span className={riskIcon.color}>
                {field.riskLevel.charAt(0).toUpperCase() + field.riskLevel.slice(1)} Risk
              </span>
            </div>
          </div>
        </div>
        
        {/* Status Message */}
        <p className={`text-sm sm:text-base ${statusColor.text} font-medium`}>
          {field.message}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Days Since Planting */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Days Since Planting</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{field.daysElapsed}</p>
          <p className="text-xs text-gray-500 mt-1">
            {field.daysElapsed > 90 ? 'Overdue' : `${90 - field.daysElapsed} days left`}
          </p>
        </div>

        {/* Size */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Field Size</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{field.field.size}</p>
          <p className="text-xs text-gray-500 mt-1">Acres</p>
        </div>

        {/* Planting Date */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Planted</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            {new Date(field.field.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(field.field.plantingDate).getFullYear()}
          </p>
        </div>

        {/* Expected Harvest */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Expected Harvest</p>
          <p className="text-lg sm:text-xl font-bold text-orange-600">
            {calculateExpectedHarvestDate(field.field.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Est. date</p>
        </div>
      </div>

      {/* Field Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Current Stage */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-3">Current Stage</p>
          <div className="flex items-center gap-3">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStageColor(field.field.currentStage)}`}>
              {field.field.currentStage.charAt(0).toUpperCase() + field.field.currentStage.slice(1)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last updated on {new Date(field.field.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Assigned Agent */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <FiUser className="w-4 h-4 text-gray-600" />
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Assigned Agent</p>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">
            {field.field.assignedAgent?.username || 'Unassigned'}
          </p>
          {field.field.assignedAgent?.email && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2">{field.field.assignedAgent.email}</p>
          )}
        </div>

        {/* Field Metadata */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-3">Field ID</p>
          <p className="text-lg sm:text-xl font-mono font-semibold text-gray-900">#{field.field.id}</p>
          <p className="text-xs text-gray-500 mt-2">
            Created {new Date(field.field.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Field Updates Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Field Updates</h2>
          {canAddUpdate && (
            <button
              onClick={() => navigate(`/fields/${id}/add-update`)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Update</span>
            </button>
          )}
        </div>

        {updates.length === 0 ? (
          <div className="text-center py-8">
            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No updates recorded yet</p>
            {canAddUpdate && (
              <p className="text-sm text-gray-400 mt-2">Add an update to track field progress</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update, index) => {
              const isAuthor = user?.id === update.agentId;
              return (
                <div key={update.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  {/* Timeline connector */}
                  {index < updates.length - 1 && (
                    <div className="absolute left-6 mt-16 h-4 border-l-2 border-gray-200" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Avatar/Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-1" />
                    </div>

                    {/* Update content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {update.agent?.username || 'Unknown Agent'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(update.createdAt).toLocaleString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStageColor(update.fieldStage)}`}>
                          {update.fieldStage.charAt(0).toUpperCase() + update.fieldStage.slice(1)}
                        </span>
                      </div>

                      {update.notes && (
                        <p className="text-sm text-gray-700 mb-3 break-words">{update.notes}</p>
                      )}

                      {/* Action buttons */}
                      {isAuthor && (
                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => navigate(`/fields/${id}/updates/${update.id}/edit`)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                            title="Edit update"
                          >
                            <FiEdit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUpdate(update.id)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
                            title="Delete update"
                          >
                            <FiTrash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
