
import React from 'react';
import KPICards from '../components/Dashboard/KPICards';
import Charts from '../components/Dashboard/Charts';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Equipment rental management overview</p>
      </div>
      
      <KPICards />
      <Charts />
    </div>
  );
};

export default DashboardPage;
