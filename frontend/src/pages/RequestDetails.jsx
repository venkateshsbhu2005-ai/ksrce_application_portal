import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Check, X, FileText, Download, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const isStudent = user?.role === 'ROLE_STUDENT';
  const rolePath = user?.role?.toLowerCase().replace('role_', '');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/${rolePath}/request/${id}`);
        setRequest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleAction = async (decision) => {
    if (!remarks.trim()) {
      setError('Remarks are required to process this request.');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      const actionPath = decision === 'APPROVED' ? 'approve' : 'reject';
      await api.put(`/${rolePath}/${id}/${actionPath}`, { decision, remarks });
      navigate(`/${rolePath}`);
    } catch (err) {
      setError('Failed to process request.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading details...</div>;
  if (!request) return <div className="p-8 text-center text-danger-500">Request not found</div>;

  const showActions = !isStudent && !request.status.includes('COMPLETED') && !request.status.includes('REJECTED');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Request Details</h2>
            <p className="text-gray-500">REQ-{request.id.toString().padStart(4, '0')}</p>
          </div>
        </div>
        
        {isStudent && request.status === 'COMPLETED' && (
          <Button onClick={() => navigate(`/student/request/${id}/letter`)}>
            <Download className="w-4 h-4 mr-2" /> Download Letter
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium text-gray-900">{request.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Register Number</p>
                  <p className="font-medium text-gray-900">{request.studentRegisterNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Type</p>
                  <p className="font-medium text-gray-900">{request.requestType.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <p className="font-medium text-gray-900">{new Date(request.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap break-words overflow-hidden">
                  {request.description}
                </div>
              </div>

              {request.attachmentUrl && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Attachments</p>
                  <a href={request.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-max">
                    <FileText className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-medium">Supporting Document.pdf</span>
                    <Download className="w-4 h-4 text-gray-400 ml-2" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {showActions && (
            <Card className="border-primary-200 bg-primary-50/50">
              <CardHeader>
                <CardTitle>Take Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && <div className="text-danger-600 text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                    placeholder="Enter approval or rejection reasons..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="danger" onClick={() => handleAction('REJECTED')} disabled={actionLoading}>
                    <X className="w-4 h-4 mr-2" /> Reject
                  </Button>
                  <Button variant="primary" onClick={() => handleAction('APPROVED')} disabled={actionLoading}>
                    <Check className="w-4 h-4 mr-2" /> Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Approval Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {/* Step 1: Student Submission */}
                <div className="flex gap-3 relative">
                  <div className="absolute left-[11px] top-7 bottom-[-24px] w-0.5 bg-gray-200"></div>
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 z-10">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Submitted</p>
                    <p className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* History Steps */}
                {request.approvalHistory.map((history, index) => {
                  const isApproved = history.decision === 'APPROVED';
                  const isLast = index === request.approvalHistory.length - 1;
                  return (
                    <div key={history.id} className="flex gap-3 relative">
                      {(!isLast || !request.status.includes('COMPLETED') && !request.status.includes('REJECTED')) && (
                        <div className="absolute left-[11px] top-7 bottom-[-24px] w-0.5 bg-gray-200"></div>
                      )}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${isApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-danger-100 text-danger-600'}`}>
                        {isApproved ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-gray-900">
                          {history.role.replace('ROLE_', '')} {isApproved ? 'Approved' : 'Rejected'}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">{new Date(history.approvedAt).toLocaleString()} by {history.approvedByName}</p>
                        <div className="bg-gray-50 rounded-md p-2 text-xs text-gray-600 border border-gray-100">
                          "{history.remarks}"
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Pending Step if not completed/rejected */}
                {!request.status.includes('COMPLETED') && !request.status.includes('REJECTED') && (
                  <div className="flex gap-3 relative">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending Review</p>
                    </div>
                  </div>
                )}
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
