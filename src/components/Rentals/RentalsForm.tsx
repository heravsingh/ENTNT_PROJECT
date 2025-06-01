import React, { useState, useEffect } from 'react';
import { useRentals } from '../../contexts/RentalsContext';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { X } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface RentalsFormProps {
  rental?: any;
  onClose: () => void;
}

const RentalsForm = ({ rental, onClose }: RentalsFormProps) => {
  const { addRental, updateRental } = useRentals();
  const { equipment } = useEquipment();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    equipmentId: '',
    equipmentName: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    startDate: '',
    endDate: '',
    status: 'Reserved' as 'Reserved' | 'Active' | 'Returned' | 'Overdue',
    dailyRate: '',
    totalAmount: '',
    notes: '',
    securityDeposit: ''
  });

  useEffect(() => {
    if (rental) {
      setFormData({
        equipmentId: rental.equipmentId || '',
        equipmentName: rental.equipmentName || '',
        customerName: rental.customerName || '',
        customerEmail: rental.customerEmail || '',
        customerPhone: rental.customerPhone || '',
        startDate: rental.startDate || '',
        endDate: rental.endDate || '',
        status: rental.status || 'Reserved',
        dailyRate: rental.dailyRate?.toString() || '',
        totalAmount: rental.totalAmount?.toString() || '',
        notes: rental.notes || '',
        securityDeposit: rental.securityDeposit?.toString() || ''
      });
    }
  }, [rental]);

  const calculateTotal = () => {
    if (formData.startDate && formData.endDate && formData.dailyRate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const total = diffDays * parseFloat(formData.dailyRate);
      setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [formData.startDate, formData.endDate, formData.dailyRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
    
    const rentalData = {
      ...formData,
      equipmentName: selectedEquipment?.name || formData.equipmentName,
      dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : undefined,
      totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
      securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : undefined,
      customerId: rental?.customerId || ''
    };

    if (rental) {
      updateRental(rental.id, rentalData);
      toast({
        title: "Rental Updated",
        description: "Rental information has been updated successfully.",
      });
    } else {
      addRental(rentalData);
      
      // Add notification for new rental
      addNotification({
        type: 'rental_created',
        title: 'New Rental Created',
        message: `${selectedEquipment?.name || 'Equipment'} rented to ${formData.customerName}`
      });
      
      toast({
        title: "Rental Created",
        description: "New rental has been created successfully.",
      });
    }
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {rental ? 'Edit Rental Record' : 'Add Rental Record'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equipment Selection */}
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment *</Label>
            <Select value={formData.equipmentId} onValueChange={(value) => handleChange('equipmentId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Customer Phone</Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleChange('customerPhone', e.target.value)}
            />
          </div>

          {/* Rental Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
                min={formData.startDate}
              />
            </div>
          </div>

          {/* Status and Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate">Daily Rate ($)</Label>
              <Input
                id="dailyRate"
                type="number"
                step="0.01"
                value={formData.dailyRate}
                onChange={(e) => handleChange('dailyRate', e.target.value)}
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount ($)</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => handleChange('totalAmount', e.target.value)}
                readOnly={!!(formData.startDate && formData.endDate && formData.dailyRate)}
                className={formData.startDate && formData.endDate && formData.dailyRate ? 'bg-gray-50' : ''}
              />
              {formData.startDate && formData.endDate && formData.dailyRate && (
                <p className="text-xs text-gray-500">Auto-calculated based on dates and daily rate</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
              <Input
                id="securityDeposit"
                type="number"
                step="0.01"
                value={formData.securityDeposit}
                onChange={(e) => handleChange('securityDeposit', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Additional notes about the rental..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {rental ? 'Update Rental' : 'Add Rental'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RentalsForm;
