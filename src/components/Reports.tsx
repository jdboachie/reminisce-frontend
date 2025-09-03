'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, Search, Filter, Trash2, RotateCcw } from 'lucide-react';
import { Button } from './ui';
import { Report } from '../types';
import { API_CONFIG, authenticatedApiCall } from '@/config/api';
import { useNotification } from '../hooks/useNotification';

interface ReportsProps {
  adminToken?: string;
  departmentInfo?: {
    name: string;
    code: string;
    slug: string;
  };
}

type ReportFilter = 'all' | 'resolved' | 'unresolved';

export const Reports: React.FC<ReportsProps> = ({ adminToken, departmentInfo }) => {
  const { showNotification } = useNotification();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<ReportFilter>('all');
  const [updatingReport, setUpdatingReport] = useState<string | null>(null);
  const [deletingReport, setDeletingReport] = useState<string | null>(null);

  // Load reports when component mounts
  useEffect(() => {
    if (adminToken) {
      loadReports();
    }
  }, [adminToken]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!adminToken) {
        throw new Error('Admin token not available');
      }
      
      console.log('Loading reports...');
      
      const response = await authenticatedApiCall(
        API_CONFIG.ENDPOINTS.GET_REPORTS,
        adminToken,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Failed to load reports: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Reports loaded:', result);
      
      if (result.success && result.data) {
        setReports(result.data);
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (reportId: string) => {
    if (!adminToken) return;

    try {
      setUpdatingReport(reportId);
      
      const response = await authenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.TOGGLE_REPORT_STATUS}/${reportId}/toggle-status`,
        adminToken,
        { method: 'PATCH' }
      );

      if (!response.ok) {
        throw new Error(`Failed to toggle report status: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Report status toggled:', result);
      
      if (result.success) {
        // Update the report in the local state
        setReports(prev => prev.map(report => 
          report._id === reportId 
            ? { ...report, resolved: !report.resolved }
            : report
        ));
        
        const newStatus = result.data?.resolved ? 'resolved' : 'unresolved';
        showNotification(`Report marked as ${newStatus}!`, 'success');
      } else {
        throw new Error(result.msg || 'Failed to toggle report status');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle report status';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setUpdatingReport(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!adminToken || !confirm('Are you sure you want to delete this report permanently? This action cannot be undone.')) return;

    try {
      setDeletingReport(reportId);
      
      const response = await authenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.DELETE_REPORT}/${reportId}`,
        adminToken,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete report: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Report deleted:', result);
      
      if (result.success) {
        // Remove the report from the local state
        setReports(prev => prev.filter(report => report._id !== reportId));
        showNotification('Report deleted permanently!', 'success');
      } else {
        throw new Error(result.msg || 'Failed to delete report');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete report';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setDeletingReport(null);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      (filter === 'resolved' && report.resolved) ||
      (filter === 'unresolved' && !report.resolved);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (!adminToken) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to view reports.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const resolvedCount = reports.filter(r => r.resolved).length;
  const unresolvedCount = reports.filter(r => !r.resolved).length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Reports Management
          </h2>
          <p className="text-slate-600 mt-1">
            Manage and resolve student reports for {departmentInfo?.name || 'your department'}
          </p>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>✓ Enhanced Management:</strong> Toggle report status, delete permanently, and filter by status
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={loadReports}
            variant="secondary"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            disabled={loading}
          >
            <div className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}>
              {loading ? '⟳' : '⟳'}
            </div>
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unresolved</p>
              <p className="text-2xl font-bold text-orange-600">{unresolvedCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading reports</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={loadReports}
              className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by title, content, student name, email, or reference number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-0 bg-transparent placeholder-slate-400 focus:ring-0 text-sm text-slate-800 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ReportFilter)}
              className="border border-slate-200 rounded-md text-sm px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Reports</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">
            {filter === 'all' ? 'No reports in the system yet.' : 
             filter === 'resolved' ? 'No resolved reports found.' : 
             'No unresolved reports found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report._id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${
              report.resolved ? 'opacity-75 bg-gray-50' : ''
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    report.resolved ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {report.resolved ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-2 text-lg">{report.title}</h3>
                    <p className="text-slate-600 mb-3 leading-relaxed">{report.content}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Student:</span>
                        <span>{report.studentName}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Ref:</span>
                        <span>{report.referenceNumber}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Email:</span>
                        <span>{report.studentEmail}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Workspace:</span>
                        <span>{report.workspaceName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                    report.resolved 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {report.resolved ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Resolved
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        Unresolved
                      </>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-sm text-slate-500">
                  Reported on: {formatDate(report.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleToggleStatus(report._id)}
                    disabled={updatingReport === report._id}
                    variant={report.resolved ? "secondary" : "primary"}
                    className={report.resolved ? 
                      "bg-orange-600 hover:bg-orange-700 text-white" : 
                      "bg-green-600 hover:bg-green-700 text-white"
                    }
                  >
                    {updatingReport === report._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        {report.resolved ? (
                          <>
                            <RotateCcw className="h-4 w-4" />
                            <span>Mark as Unresolved</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Mark as Resolved</span>
                          </>
                        )}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => handleDeleteReport(report._id)}
                    disabled={deletingReport === report._id}
                    variant="danger"
                  >
                    {deletingReport === report._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};