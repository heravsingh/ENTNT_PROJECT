
import React from 'react';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Wrench } from 'lucide-react';

interface MaintenanceListProps {
  onEdit: (maintenance: any) => void;
}

const MaintenanceList = ({ onEdit }: MaintenanceListProps) => {
  const { maintenance, deleteMaintenance } = useMaintenance();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Routine Check': return 'bg-blue-100 text-blue-800';
      case 'Repair': return 'bg-red-100 text-red-800';
      case 'Preventive': return 'bg-green-100 text-green-800';
      case 'Emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      deleteMaintenance(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {maintenance.map((record) => (
        <Card key={record.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{record.equipmentName}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(record)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(record.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm font-medium">{record.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <Badge className={getTypeColor(record.type)}>
                  {record.type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </div>
              {record.technician && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Technician:</span>
                  <span className="text-sm font-medium">{record.technician}</span>
                </div>
              )}
              {record.cost && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost:</span>
                  <span className="text-sm font-medium">${record.cost}</span>
                </div>
              )}
            </div>
            {record.notes && (
              <p className="text-sm text-gray-600 mt-3">{record.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
      
      {maintenance.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No maintenance records found. Add a maintenance record to get started.</p>
        </div>
      )}
    </div>
  );
};
export default MaintenanceList;