
import React from 'react';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useRentals } from '../../contexts/RentalsContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { Card, CardContent } from '../ui/card';

const KPICards = () => {
  const { equipment } = useEquipment();
  const { rentals, getOverdueRentals } = useRentals();
  const { getUpcomingMaintenance } = useMaintenance();

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(eq => eq.status === 'Available').length;
  const rentedEquipment = equipment.filter(eq => eq.status === 'Rented').length;
  const overdueRentals = getOverdueRentals().length;
  const upcomingMaintenance = getUpcomingMaintenance().length;

  const kpis = [
    {
      title: 'Total Equipment',
      value: totalEquipment,
      subtitle: 'Items in inventory',
      color: 'bg-blue-500'
    },
    {
      title: 'Available',
      value: availableEquipment,
      subtitle: 'Ready for rental',
      color: 'bg-green-500'
    },
    {
      title: 'Currently Rented',
      value: rentedEquipment,
      subtitle: 'Out on rental',
      color: 'bg-yellow-500'
    },
    {
      title: 'Overdue Returns',
      value: overdueRentals,
      subtitle: 'Need attention',
      color: 'bg-red-500'
    },
    {
      title: 'Upcoming Maintenance',
      value: upcomingMaintenance,
      subtitle: 'Scheduled soon',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`${kpi.color} h-2`}></div>
            <div className="p-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {kpi.value}
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                {kpi.title}
              </div>
              <div className="text-xs text-gray-500">
                {kpi.subtitle}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
