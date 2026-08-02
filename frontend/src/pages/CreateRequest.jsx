import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UploadCloud, Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const CreateRequest = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const requestTypes = [
    { value: 'BUS_FEE_CANCELLATION', label: 'Bus Fee Cancellation' },
    { value: 'NEW_ID_CARD', label: 'New ID Card' },
    { value: 'BONAFIDE_CERTIFICATE', label: 'Bonafide Certificate' },
    { value: 'LEAVE_REQUEST', label: 'Leave Request' },
    { value: 'OTHER', label: 'Other Request' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // In a real app, you would upload the file to Supabase Storage here and get the URL.
      // For this prototype, we'll mock the URL.
      const payload = {
        requestType: data.requestType,
        description: data.description,
        attachmentUrl: 'https://example.com/mock-document.pdf'
      };
      
      await api.post('/student/request', payload);
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/student')} className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create Request</h2>
          <p className="text-gray-500">Submit a new request for approval.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Fill out the form below with the necessary information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-danger-50 text-danger-600 p-3 rounded-md text-sm border border-danger-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('requestType', { required: 'Please select a request type' })}
              >
                <option value="">Select a type...</option>
                {requestTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.requestType && <span className="text-danger-500 text-xs mt-1 block">{errors.requestType.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Description</label>
              <textarea
                className="flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[120px] resize-y"
                placeholder="Please explain the reason for your request in detail..."
                {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Description must be at least 20 characters' } })}
              />
              {errors.description && <span className="text-danger-500 text-xs mt-1 block">{errors.description.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Document</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <div className="w-12 h-12 mx-auto bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <UploadCloud className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex text-sm text-gray-600 mt-4 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.png,.jpg,.jpeg" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => navigate('/student')}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRequest;
