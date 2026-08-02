import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UploadCloud, FileSpreadsheet, Loader2, Download, Edit2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const ManageStudents = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // For Add Single
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleMessage, setSingleMessage] = useState(null);

  // For Bulk
  const [file, setFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState(null);

  // For Edit/Delete
  const [editingStudent, setEditingStudent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [activeTab]);

  const fetchStudents = async () => {
    if (activeTab !== 'list') return;
    setLoading(true);
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSingleSubmit = async (data) => {
    setSingleLoading(true);
    setSingleMessage(null);
    try {
      const res = await api.post('/admin/student', data);
      setSingleMessage({ type: 'success', text: res.data.message });
      reset();
    } catch (err) {
      setSingleMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add student.' });
    } finally {
      setSingleLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onBulkSubmit = async () => {
    if (!file) return;
    setBulkLoading(true);
    setBulkMessage(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/admin/students/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBulkMessage({ type: 'success', text: res.data.message });
      setFile(null);
    } catch (err) {
      setBulkMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload students.' });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/admin/user/${id}`);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put(`/admin/user/${editingStudent.id}`, editingStudent);
      setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
      setEditingStudent(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user.");
    } finally {
      setEditLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Name,Email,Register Number,Department,Mentor Email\nJohn Doe,john.doe@student.college.edu,REG123,Computer Science,mentor@college.edu";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "student_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manage Students</h2>
        <p className="text-gray-500">View, edit, or add students to the system.</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`pb-3 px-4 font-medium text-sm transition-colors relative ${activeTab === 'list' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('list')}
        >
          View All Students
          {activeTab === 'list' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>}
        </button>
        <button
          className={`pb-3 px-4 font-medium text-sm transition-colors relative ${activeTab === 'single' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('single')}
        >
          Add Single
          {activeTab === 'single' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>}
        </button>
        <button
          className={`pb-3 px-4 font-medium text-sm transition-colors relative ${activeTab === 'bulk' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('bulk')}
        >
          Bulk Upload
          {activeTab === 'bulk' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>}
        </button>
      </div>

      {activeTab === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>Students Directory</CardTitle>
            <CardDescription>A list of all students currently in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary-600" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Register No.</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No students found.</td></tr>
                    ) : students.map((s) => (
                      <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                        <td className="px-6 py-4 text-gray-600">{s.registerNumber}</td>
                        <td className="px-6 py-4 text-gray-600">{s.email}</td>
                        <td className="px-6 py-4 text-gray-600">{s.department}</td>
                        <td className="px-6 py-4 flex justify-end gap-2">
                          <button onClick={() => setEditingStudent({ ...s, mentorEmail: s.mentor?.email || '' })} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-danger-600 hover:bg-danger-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-lg">Edit Student</h3>
              <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={editingStudent.email} onChange={e => setEditingStudent({...editingStudent, email: e.target.value})} className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
                <input required value={editingStudent.registerNumber} onChange={e => setEditingStudent({...editingStudent, registerNumber: e.target.value})} className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input required value={editingStudent.department} onChange={e => setEditingStudent({...editingStudent, department: e.target.value})} className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentor Email</label>
                <input required type="email" value={editingStudent.mentorEmail} onChange={e => setEditingStudent({...editingStudent, mentorEmail: e.target.value})} className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditingStudent(null)}>Cancel</Button>
                <Button type="submit" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'single' && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
            <CardDescription>Enter the details to create a new student account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSingleSubmit)} className="space-y-4">
              {singleMessage && (
                <div className={`p-3 rounded-md text-sm border ${singleMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-danger-50 text-danger-700 border-danger-100'}`}>
                  {singleMessage.text}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <span className="text-danger-500 text-xs mt-1">{errors.name.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <span className="text-danger-500 text-xs mt-1">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('registerNumber', { required: 'Register Number is required' })}
                  />
                  {errors.registerNumber && <span className="text-danger-500 text-xs mt-1">{errors.registerNumber.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('department', { required: 'Department is required' })}
                  />
                  {errors.department && <span className="text-danger-500 text-xs mt-1">{errors.department.message}</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentor Email</label>
                <input
                  type="email"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  {...register('mentorEmail', { required: 'Mentor Email is required' })}
                />
                {errors.mentorEmail && <span className="text-danger-500 text-xs mt-1">{errors.mentorEmail.message}</span>}
                <p className="text-xs text-gray-500 mt-1">This email must match an existing Mentor account.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={singleLoading}>
                  {singleLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Add Student'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'bulk' && (
        <Card className="max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bulk Upload</CardTitle>
              <CardDescription>Upload an Excel (.xlsx) file to add multiple students.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" /> Template
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {bulkMessage && (
                <div className={`p-3 rounded-md text-sm border ${bulkMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-danger-50 text-danger-700 border-danger-100'}`}>
                  {bulkMessage.text}
                </div>
            )}
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="space-y-1 text-center">
                <div className="w-12 h-12 mx-auto bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <FileSpreadsheet className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex text-sm text-gray-600 mt-4 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>{file ? file.name : 'Upload a file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx, .csv" onChange={handleFileChange} />
                  </label>
                  {!file && <p className="pl-1">or drag and drop</p>}
                </div>
                <p className="text-xs text-gray-500">
                  .xlsx up to 10MB
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={onBulkSubmit} disabled={bulkLoading || !file}>
                {bulkLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Process Upload'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default ManageStudents;
