
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useRentals } from '../../contexts/RentalsContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const Charts = () => {
  const { equipment } = useEquipment();
  const { rentals } = useRentals();

  // Equipment by category data
  const categoryData = equipment.reduce((acc, eq) => {
    const existing = acc.find(item => item.category === eq.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category: eq.category, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]);

  // Equipment status data
  const statusData = [
    { name: 'Available', value: equipment.filter(eq => eq.status === 'Available').length, color: '#10B981' },
    { name: 'Rented', value: equipment.filter(eq => eq.status === 'Rented').length, color: '#F59E0B' },
    { name: 'Maintenance', value: equipment.filter(eq => eq.status === 'Maintenance').length, color: '#8B5CF6' },
    { name: 'Out of Service', value: equipment.filter(eq => eq.status === 'Out of Service').length, color: '#EF4444' }
  ];

  // Rental status data
  const rentalStatusData = [
    { name: 'Reserved', value: rentals.filter(r => r.status === 'Reserved').length },
    { name: 'Active', value: rentals.filter(r => r.status === 'Active').length },
    { name: 'Returned', value: rentals.filter(r => r.status === 'Returned').length },
    { name: 'Overdue', value: rentals.filter(r => r.status === 'Overdue').length }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Equipment by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rental Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rentalStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
