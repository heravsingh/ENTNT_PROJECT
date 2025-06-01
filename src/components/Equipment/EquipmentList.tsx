
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEquipment } from '../../contexts/EquipmentContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';

interface EquipmentListProps {
  onEdit: (equipment: any) => void;
}

const EquipmentList = ({ onEdit }: EquipmentListProps) => {
  const navigate = useNavigate();
  const { equipment, deleteEquipment } = useEquipment();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500';
      case 'Rented': return 'bg-yellow-500';
      case 'Maintenance': return 'bg-blue-500';
      case 'Out of Service': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      deleteEquipment(id);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/equipment/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(item.id)}
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
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
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Condition:</span>
                <Badge className={getConditionColor(item.condition)}>
                  {item.condition}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
              </div>
              {item.dailyRate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Rate:</span>
                  <span className="text-sm font-medium">${item.dailyRate}</span>
                </div>
              )}
              {item.location && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium">{item.location}</span>
                </div>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-gray-600 mt-3">{item.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
      
      {equipment.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No equipment found. Add some equipment to get started.</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
