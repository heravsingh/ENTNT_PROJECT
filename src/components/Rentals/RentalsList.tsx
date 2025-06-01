
import React from 'react';
import { useRentals } from '../../contexts/RentalsContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import RentalStatusUpdate from './RentalStatusUpdate';

interface RentalsListProps {
  onEdit: (rental: any) => void;
}

const RentalsList = ({ onEdit }: RentalsListProps) => {
  const { rentals, deleteRental } = useRentals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reserved': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Returned': return 'bg-gray-100 text-gray-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this rental?')) {
      deleteRental(id);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {rentals.map((rental) => (
        <Card key={rental.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{rental.equipmentName}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(rental)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(rental.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Customer:</span>
                <p className="font-medium">{rental.customerName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Start Date:</span>
                <p className="font-medium">{rental.startDate}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">End Date:</span>
                <p className="font-medium">{rental.endDate}</p>
              </div>
              {rental.totalAmount && (
                <div>
                  <span className="text-sm text-gray-600">Total:</span>
                  <p className="font-medium">${rental.totalAmount}</p>
                </div>
              )}
            </div>
            
            <RentalStatusUpdate rental={rental} />
            
            {rental.notes && (
              <div className="pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">Notes:</span>
                <p className="text-sm text-gray-700 mt-1">{rental.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {rentals.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No rentals found. Create a rental to get started.</p>
        </div>
      )}
    </div>
  );
};

export default RentalsList;
