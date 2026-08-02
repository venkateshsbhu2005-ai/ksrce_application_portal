import React from 'react';
import { Clock } from 'lucide-react';

const History = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Activity History</h2>
        <p className="text-gray-500 max-w-md">
          Your recent activity and historical records will appear here. This feature is currently under development.
        </p>
      </div>
    </div>
  );
};

export default History;
