import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fieldService } from '../services/fieldService';
import { FiHardDrive, FiLoader, FiAlertCircle, FiGrid, FiList, FiX, FiChevronDown } from 'react-icons/fi';

export function AgentDashboard() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('table'); // 'table' or 'card'
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true); // Show/hide filters on mobile
  const ITEMS_PER_PAGE = parseInt(import.meta.env.VITE_ITEMS_PER_PAGE) || 10;
  const [filters, setFilters] = useState({
    location: '',
    minSize: '',
    maxSize: '',
    stage: '',
    status: '',
  });


  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fieldService.getMyFields();
      setFields(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your fields');
    } finally {
      setLoading(false);
    }
  };

  // Calculate status breakdown
  const statusBreakdown = {
    planted: fields.filter((f) => f.field?.currentStage === 'planted').length,
    growing: fields.filter((f) => f.field?.currentStage === 'growing').length,
    ready: fields.filter((f) => f.field?.currentStage === 'ready').length,
    harvested: fields.filter((f) => f.field?.currentStage === 'harvested').length,
  };

  // Apply filters
  const filteredFields = fields.filter((fieldData) => {
    const field = fieldData.field;
    
    // Location filter (case-insensitive)
    if (filters.location && !field.location?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Size filter (range)
    const size = parseFloat(field.size);
    if (filters.minSize && size < parseFloat(filters.minSize)) {
      return false;
    }
    if (filters.maxSize && size > parseFloat(filters.maxSize)) {
      return false;
    }
    
    // Stage filter
    if (filters.stage && field.currentStage !== filters.stage) {
      return false;
    }
    
    // Status filter
    if (filters.status && fieldData.status !== filters.status) {
      return false;
    }
    
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFields.length / ITEMS_PER_PAGE);
  const paginatedFields = filteredFields.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when view changes
  const handleViewChange = (view) => {
    setViewType(view);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      location: '',
      minSize: '',
      maxSize: '',
      stage: '',
      status: '',
    });
    setCurrentPage(1);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Fields</h1>
        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleViewChange('table')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded transition-colors text-xs sm:text-sm ${
              viewType === 'table'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Table view"
          >
            <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => handleViewChange('card')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded transition-colors text-xs sm:text-sm ${
              viewType === 'card'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Card view"
          >
            <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">My Fields</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{fields.length}</p>
            </div>
            <FiHardDrive className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-lg shadow">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Planted</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{statusBreakdown.planted}</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-lg shadow">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Growing</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{statusBreakdown.growing}</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-lg shadow">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Ready</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">{statusBreakdown.ready}</p>
          </div>
        </div>

        <div className="hidden sm:block bg-white p-3 sm:p-6 rounded-lg shadow">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Harvested</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{statusBreakdown.harvested}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-6 mb-6 sm:mb-8">
        {/* Mobile Filter Header with Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex justify-between items-center w-full sm:hidden mb-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <FiChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Desktop Filter Header (always visible on desktop) */}
        <div className="hidden sm:flex sm:justify-between sm:items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {Object.values(filters).some((val) => val !== '') && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              <FiX className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Mobile Filter Inputs (collapsible) */}
        {showFilters && (
          <div className="sm:hidden mb-4 flex justify-end">
            {Object.values(filters).some((val) => val !== '') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                <FiX className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Filter Grid - Always visible on desktop, collapsible on mobile */}
        {(showFilters || window.innerWidth >= 640) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Size Filter - Min */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Min Size
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minSize}
                  onChange={(e) => handleFilterChange('minSize', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  min="0"
                />
              </div>

              {/* Size Filter - Max */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Max Size
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxSize}
                  onChange={(e) => handleFilterChange('maxSize', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  min="0"
                />
              </div>

              {/* Stage Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  value={filters.stage}
                  onChange={(e) => handleFilterChange('stage', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Stages</option>
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="ready">Ready</option>
                  <option value="harvested">Harvested</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="at_risk">At Risk</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
        )}
      </div>

      {/* Fields Table or Cards */}
      {viewType === 'table' ? (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Name
                </th>
                <th className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Crop
                </th>
                <th className="hidden md:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Location
                </th>
                <th className="hidden lg:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Size
                </th>
                <th className="hidden lg:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Plant Date
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Stage
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-700 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fields.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-2 sm:px-6 py-4 text-center text-gray-500 text-sm">
                    No fields assigned to you yet
                  </td>
                </tr>
              ) : (
                paginatedFields.map((fieldData) => (
                  <tr key={fieldData.field.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900 truncate">{fieldData.field.name}</td>
                    <td className="hidden sm:table-cell px-2 sm:px-6 py-3 text-xs sm:text-sm text-gray-900">{fieldData.field.cropType}</td>
                    <td className="hidden md:table-cell px-2 sm:px-6 py-3 text-xs sm:text-sm text-gray-900">{fieldData.field.location}</td>
                    <td className="hidden lg:table-cell px-2 sm:px-6 py-3 text-xs sm:text-sm text-gray-900">{fieldData.field.size}</td>
                    <td className="hidden lg:table-cell px-2 sm:px-6 py-3 text-xs sm:text-sm text-gray-900">
                      {new Date(fieldData.field.plantingDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-6 py-3 text-xs sm:text-sm">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
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
                    <td className="px-2 sm:px-6 py-3 text-xs sm:text-sm">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          fieldData.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : fieldData.status === 'at_risk'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {fieldData.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-center">
                      <button
                        onClick={() => navigate(`/fields/${fieldData.field.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm py-1 px-1.5 sm:px-2 rounded hover:bg-blue-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {fields.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
              <p className="text-gray-500 text-base sm:text-lg">No fields assigned to you yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {paginatedFields.map((fieldData) => (
                <div
                  key={fieldData.field.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 sm:p-4 text-white">
                    <h3 className="text-base sm:text-lg font-bold truncate">{fieldData.field.name}</h3>
                    <p className="text-green-100 text-xs sm:text-sm truncate">{fieldData.field.cropType}</p>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Location</p>
                        <p className="text-gray-900 font-semibold truncate">{fieldData.field.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Size</p>
                        <p className="text-gray-900 font-semibold">{fieldData.field.size} acres</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Plant Date</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(fieldData.field.plantingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Stage</p>
                        <p className="text-gray-900 font-semibold">{fieldData.field.currentStage}</p>
                      </div>
                    </div>

                    <div className="flex gap-1 sm:gap-2 pt-2">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
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
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          fieldData.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : fieldData.status === 'at_risk'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {fieldData.status}
                      </span>
                    </div>

                    <div className="pt-2 space-y-1 sm:space-y-2 border-t border-gray-200">
                      <button
                        onClick={() => navigate(`/fields/${fieldData.field.id}`)}
                        className="w-full text-blue-600 hover:text-blue-800 font-semibold py-1.5 sm:py-2 rounded hover:bg-blue-50 transition text-xs sm:text-sm"
                      >
                        View & Update
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {fields.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6 sm:mt-8 flex-wrap">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs sm:text-sm"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs sm:text-sm"
          >
            Prev
          </button>

          {/* Page Numbers */}
          <div className="flex gap-0.5 sm:gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show page numbers around current page
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage && page === 2) {
                return <span key="dots-start" className="px-1 sm:px-2 py-1.5 sm:py-2 text-gray-500 text-xs sm:text-sm">...</span>;
              }
              if (!showPage && page === totalPages - 1) {
                return <span key="dots-end" className="px-1 sm:px-2 py-1.5 sm:py-2 text-gray-500 text-xs sm:text-sm">...</span>;
              }

              return showPage ? (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded border text-xs sm:text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ) : null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs sm:text-sm"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs sm:text-sm"
          >
            Last
          </button>

          <div className="text-gray-600 font-medium text-xs sm:text-sm">
            {currentPage}/{totalPages}
          </div>
        </div>
      )}
    </div>
  );
}
