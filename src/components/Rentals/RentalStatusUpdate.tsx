
import React, { useState } from 'react';
import { useRentals } from '../../contexts/RentalsContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from '../ui/use-toast';

interface RentalStatusUpdateProps {
  rental: any;
  onUpdate?: () => void;
}

const RentalStatusUpdate = ({ rental, onUpdate }: RentalStatusUpdateProps) => {
  const [newStatus, setNewStatus] = useState(rental.status);
  const { updateRental } = useRentals();
  const { addNotification } = useNotifications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reserved': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Returned': return 'bg-gray-100 text-gray-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = () => {
    if (newStatus !== rental.status) {
      updateRental(rental.id, { status: newStatus });
      
      // Add notification based on status change
      if (newStatus === 'Returned') {
        addNotification({
          type: 'rental_returned',
          title: 'Rental Returned',
          message: `${rental.equipmentName} has been returned by ${rental.customerName}`
        });
      }
      
      toast({
        title: "Status Updated",
        description: `Rental status changed to ${newStatus}`,
      });
      
      onUpdate?.();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Current Status:</span>
        <Badge className={getStatusColor(rental.status)}>
          {rental.status}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={newStatus} onValueChange={setNewStatus}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Reserved">Reserved</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Returned">Returned</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          size="sm"
          onClick={handleStatusUpdate}
          disabled={newStatus === rental.status}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default RentalStatusUpdate;
