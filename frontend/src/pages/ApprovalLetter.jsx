import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Printer, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const ApprovalLetter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const rolePath = user?.role?.toLowerCase().replace('role_', '');
        const res = await api.get(`/${rolePath}/request/${id}`);
        setRequest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, user]);

  if (loading) return <div className="p-8 text-center">Generating letter...</div>;
  if (!request || request.status !== 'COMPLETED') return <div className="p-8 text-center text-danger-500">Letter not available.</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:bg-white print:p-0">
      
      {/* Controls - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
        </Button>
      </div>

      {/* A4 Paper Container */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-xl print:shadow-none p-12 print:p-0">
        
        {/* Letterhead */}
        <div className="text-center border-b-2 border-gray-900 pb-6 mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-lg mx-auto mb-4 flex items-center justify-center print:border-2 print:border-primary-600 print:bg-transparent">
            <span className="text-white font-bold text-lg print:text-primary-600 tracking-tight">KSRCE</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">K.S.R College of Engineering (KSRCE)</h1>
          <p className="text-sm text-gray-500 mt-1">K.S.R. Kalvi Nagar, Tiruchengode - 637 215</p>
          <p className="text-sm text-gray-500">Email: info@ksrce.ac.in | Phone: 04288 - 274213</p>
        </div>

        {/* Letter Meta */}
        <div className="flex justify-between text-sm text-gray-700 mb-12">
          <div>
            <p><strong>Ref No:</strong> KSRCE/REQ/{request.id.toString().padStart(4, '0')}</p>
          </div>
          <div>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-bold underline mb-8 uppercase">
          Official Approval Authorization Letter
        </h2>

        {/* Body */}
        <div className="space-y-6 text-gray-800 leading-relaxed text-justify">
          <p><strong>To Whom It May Concern,</strong></p>
          <p>
            This letter serves as an official authorization and approval for <strong>{request.studentName}</strong>, 
            bearing the Register Number <strong>{request.studentRegisterNumber}</strong>, from the 
            Department of <strong>{user?.department || 'Engineering'}</strong>.
          </p>
          <p>
            The student had submitted a formal request for <strong>{request.requestType.replace(/_/g, ' ')}</strong> on <strong>{new Date(request.createdAt).toLocaleDateString()}</strong>. 
            The stated purpose for this request was: <span className="italic bg-gray-100 px-1 print:bg-transparent text-gray-700">"{request.description}"</span>.
          </p>
          <p>
            After thorough verification, this request has successfully passed through all levels of the administrative workflow and has been fully approved by the authorized personnel on <strong>{new Date(request.updatedAt).toLocaleDateString()}</strong>.
          </p>
          
          <div className="bg-gray-50 p-6 border border-gray-200 mt-6 print:border-gray-300 rounded-lg shadow-sm print:shadow-none">
            <h4 className="font-bold text-base mb-4 text-gray-900 border-b border-gray-200 pb-3 print:border-gray-300 uppercase tracking-wide">Detailed Approval Workflow Verification</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-12 text-sm">
                <div className="col-span-4 font-semibold text-gray-700">Submission Date:</div>
                <div className="col-span-8 text-gray-900">{new Date(request.createdAt).toLocaleString()}</div>
              </div>
              
              {request.approvalHistory.map((history, i) => (
                <div key={i} className="grid grid-cols-12 text-sm border-t border-gray-100 pt-4 print:border-gray-200">
                  <div className="col-span-4 font-semibold text-gray-700">{history.role.replace('ROLE_', '')} Approval:</div>
                  <div className="col-span-8 text-gray-900 flex flex-col">
                    <span>Approved by <strong>{history.approvedByName}</strong> on {new Date(history.approvedAt).toLocaleString()}</span>
                    {history.remarks && <span className="text-gray-500 text-xs mt-1 italic border-l-2 border-gray-300 pl-2">Remarks: "{history.remarks}"</span>}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-12 text-sm border-t border-gray-200 pt-4 font-medium">
                <div className="col-span-4 font-bold text-gray-900">Final Authorization:</div>
                <div className="col-span-8 text-emerald-600 font-bold uppercase tracking-wider">COMPLETED AND VERIFIED</div>
              </div>
            </div>
          </div>
          
          <p className="pt-2">
            Please proceed with the necessary actions as per the institutional guidelines.
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-24 pt-12 flex justify-between text-center border-t border-gray-200 print:border-gray-800">
          <div>
            <div className="w-32 border-b border-gray-400 mx-auto mb-2"></div>
            <p className="text-sm font-semibold">Student Signature</p>
          </div>
          <div>
            <div className="w-48 mx-auto mb-2 font-bold italic text-primary-600 text-lg">Digitally Signed & Approved</div>
            <div className="w-48 border-b border-gray-400 mx-auto mb-2"></div>
            <p className="text-sm font-semibold">Principal</p>
            <p className="text-xs text-gray-500 mt-1">K.S.R College of Engineering</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApprovalLetter;
