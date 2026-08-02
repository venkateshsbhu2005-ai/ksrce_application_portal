import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Moon, Sun, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import api from '../services/api';

const Settings = () => {
  const { user, login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your profile, security, and preferences</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-1">
          {[
            { id: 'profile', icon: User, label: 'Profile Information' },
            { id: 'security', icon: Lock, label: 'Security & Password' },
            { id: 'appearance', icon: theme === 'dark' ? Moon : Sun, label: 'Appearance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          {activeTab === 'profile' && <ProfileForm user={user} login={login} />}
          {activeTab === 'security' && <SecurityForm />}
          {activeTab === 'appearance' && <AppearanceForm theme={theme} toggleTheme={toggleTheme} />}
        </main>
      </div>
    </div>
  );
};

const ProfileForm = ({ user, login }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/users/profile', data);
      // Update local storage user state with new data
      login(res.data, localStorage.getItem('token'));
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
      
      {message.text && (
        <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-danger-50 text-danger-700 border border-danger-100 dark:bg-danger-900/30 dark:text-danger-400 dark:border-danger-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <Input 
            {...register('name', { required: 'Name is required' })}
            className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
          {errors.name && <p className="mt-1 text-sm text-danger-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
          <Input 
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
          {errors.email && <p className="mt-1 text-sm text-danger-500">{errors.email.message}</p>}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

const SecurityForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put('/users/password', data);
      setMessage({ type: 'success', text: 'Password changed successfully.' });
      reset();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security & Password</h3>
      
      {message.text && (
        <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-danger-50 text-danger-700 border border-danger-100 dark:bg-danger-900/30 dark:text-danger-400 dark:border-danger-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
          <Input 
            type="password"
            {...register('currentPassword', { required: 'Current password is required' })}
            className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
          {errors.currentPassword && <p className="mt-1 text-sm text-danger-500">{errors.currentPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
          <Input 
            type="password"
            {...register('newPassword', { 
              required: 'New password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
          {errors.newPassword && <p className="mt-1 text-sm text-danger-500">{errors.newPassword.message}</p>}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

const AppearanceForm = ({ theme, toggleTheme }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance Preferences</h3>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
        </div>
        <button 
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};

export default Settings;
