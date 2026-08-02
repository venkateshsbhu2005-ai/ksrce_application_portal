import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import api from '../services/api';

const ApproverDashboard = ({ role }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // role should be 'mentor', 'hod', or 'principal'
  const endpoint = `/${role}/pending`;
  const dashboardTitle = `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get(endpoint);
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [endpoint]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{dashboardTitle}</h2>
        <p className="text-gray-500">Review and manage pending approval requests.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium text-sm">Action Required</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{requests.length}</h3>
            </div>
            <div className="p-3 bg-warning-50 rounded-xl">
              <Clock className="w-6 h-6 text-warning-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>Requests waiting for your review and approval.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500 animate-pulse">Loading requests...</div>
          ) : requests.length === 0 ? (
             <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-sm">There are no pending requests for you to review at this moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Request ID</th>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date Submitted</th>
                    <th className="px-6 py-3 rounded-tr-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">REQ-{req.id.toString().padStart(4, '0')}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{req.studentName}</div>
                        <div className="text-xs text-gray-500">{req.studentRegisterNumber}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{req.requestType.replace(/_/g, ' ')}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button onClick={() => navigate(`/${role}/request/${req.id}`)}>
                          Review
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

export default ApproverDashboard;
