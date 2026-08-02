import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  const stats = [
    { title: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Total Requests', value: '1,245', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { title: 'Approved', value: '892', icon: CheckCircle, color: 'text-primary-500', bg: 'bg-primary-100' },
    { title: 'Pending', value: '353', icon: Clock, color: 'text-warning-500', bg: 'bg-warning-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
        <p className="text-gray-500">Monitor platform activity and manage users.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>A list of recently registered users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 rounded-tr-lg">Department</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-100">
                        {user.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.department || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
