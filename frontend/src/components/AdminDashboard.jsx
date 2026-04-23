import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fieldService } from '../services/fieldService';
import { userService } from '../services/userService';
import { FiHardDrive, FiLoader, FiAlertCircle, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fieldService.getFields();
      console.log('Fetched fields:', response.data);
      setFields(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        await fieldService.deleteField(fieldId);
        fetchFields();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete field');
      }
    }
  };

  // Calculate status breakdown
  const statusBreakdown = {
    planted: fields.filter((f) => f.field?.currentStage === 'planted').length,
    growing: fields.filter((f) => f.field?.currentStage === 'growing').length,
    ready: fields.filter((f) => f.field?.currentStage === 'ready').length,
    harvested: fields.filter((f) => f.field?.currentStage === 'harvested').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => navigate('/fields/create')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <FiPlus className="w-5 h-5" />
          Add Field
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-600" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchFields}
            className="text-red-600 hover:text-red-800 font-semibold text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Fields</p>
              <p className="text-3xl font-bold text-gray-900">{fields.length}</p>
            </div>
            <FiHardDrive className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div>
            <p className="text-gray-600 text-sm font-medium">Planted</p>
            <p className="text-3xl font-bold text-green-600">{statusBreakdown.planted}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div>
            <p className="text-gray-600 text-sm font-medium">Growing</p>
            <p className="text-3xl font-bold text-yellow-600">{statusBreakdown.growing}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div>
            <p className="text-gray-600 text-sm font-medium">Ready</p>
            <p className="text-3xl font-bold text-orange-600">{statusBreakdown.ready}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div>
            <p className="text-gray-600 text-sm font-medium">Harvested</p>
            <p className="text-3xl font-bold text-purple-600">{statusBreakdown.harvested}</p>
          </div>
        </div>
      </div>

      {/* Fields Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Crop Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Planting Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Assigned Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No fields found
                </td>
              </tr>
            ) : (
              fields.map((fieldData) => (
                <tr key={fieldData.field.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{fieldData.field.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{fieldData.field.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{fieldData.field.cropType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(fieldData.field.plantingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        fieldData.field.currentStage === 'planted'
                          ? 'bg-green-100 text-green-800'
                          : fieldData.field.currentStage === 'growing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : fieldData.field.currentStage === 'ready'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {fieldData.field.currentStage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {fieldData.field.assignedAgent?.username || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => navigate(`/fields/${fieldData.field.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/fields/${fieldData.field.id}/edit`)}
                      className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-1"
                    >
                      <FiEdit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteField(fieldData.field.id)}
                      className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
