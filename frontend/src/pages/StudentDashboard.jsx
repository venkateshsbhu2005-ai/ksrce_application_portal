import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusCircle, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/student/my-requests');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'REQUEST_SUBMITTED': { color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Clock },
      'MENTOR_APPROVED': { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle },
      'HOD_APPROVED': { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle },
      'COMPLETED': { color: 'text-primary-700 bg-primary-50 border-primary-200', icon: CheckCircle },
      'MENTOR_REJECTED': { color: 'text-danger-700 bg-danger-50 border-danger-200', icon: XCircle },
      'HOD_REJECTED': { color: 'text-danger-700 bg-danger-50 border-danger-200', icon: XCircle },
      'PRINCIPAL_REJECTED': { color: 'text-danger-700 bg-danger-50 border-danger-200', icon: XCircle },
    };
    const config = statusConfig[status] || { color: 'text-gray-700 bg-gray-50 border-gray-200', icon: Clock };
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Portal</h2>
          <p className="text-gray-500">Welcome back! Here's an overview of your requests.</p>
        </div>
        <Button onClick={() => navigate('/student/create')} className="shrink-0">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0 shadow-lg shadow-primary-500/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-primary-100 font-medium text-sm">Total Requests</p>
              <h3 className="text-3xl font-bold mt-1">{requests.length}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium text-sm">Pending</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {requests.filter(r => !r.status.includes('COMPLETED') && !r.status.includes('REJECTED')).length}
              </h3>
            </div>
            <div className="p-3 bg-warning-50 rounded-xl">
              <Clock className="w-6 h-6 text-warning-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium text-sm">Completed</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {requests.filter(r => r.status === 'COMPLETED').length}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>Track the status of your recent applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500 animate-pulse">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No requests yet</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-sm">You haven't submitted any approval requests yet. Click the button below to get started.</p>
              <Button onClick={() => navigate('/student/create')} variant="outline">Create your first request</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Request ID</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 rounded-tr-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">REQ-{req.id.toString().padStart(4, '0')}</td>
                      <td className="px-6 py-4 font-medium text-gray-700">{req.requestType.replace(/_/g, ' ')}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/student/request/${req.id}`)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
