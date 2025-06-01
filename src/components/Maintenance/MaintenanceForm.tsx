
import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useEquipment } from '../../contexts/EquipmentContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { X } from 'lucide-react';

interface MaintenanceFormProps {
  maintenance?: any;
  onClose: () => void;
}

const MaintenanceForm = ({ maintenance, onClose }: MaintenanceFormProps) => {
  const { addMaintenance, updateMaintenance } = useMaintenance();
  const { equipment } = useEquipment();
  const [formData, setFormData] = useState({
    equipmentId: '',
    equipmentName: '',
    date: '',
    type: 'Routine Check' as 'Routine Check' | 'Repair' | 'Preventive' | 'Emergency',
    status: 'Scheduled' as 'Scheduled' | 'In Progress' | 'Completed',
    notes: '',
    cost: '',
    technician: ''
  });

  useEffect(() => {
    if (maintenance) {
      setFormData({
        equipmentId: maintenance.equipmentId || '',
        equipmentName: maintenance.equipmentName || '',
        date: maintenance.date || '',
        type: maintenance.type || 'Routine Check',
        status: maintenance.status || 'Scheduled',
        notes: maintenance.notes || '',
        cost: maintenance.cost?.toString() || '',
        technician: maintenance.technician || ''
      });
    }
  }, [maintenance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
    
    const maintenanceData = {
      ...formData,
      equipmentName: selectedEquipment?.name || formData.equipmentName,
      cost: formData.cost ? parseFloat(formData.cost) : undefined
    };

    if (maintenance) {
      updateMaintenance(maintenance.id, maintenanceData);
    } else {
      addMaintenance(maintenanceData);
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
          {maintenance ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine Check">Routine Check</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technician">Technician</Label>
              <Input
                id="technician"
                value={formData.technician}
                onChange={(e) => handleChange('technician', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleChange('cost', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes *</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {maintenance ? 'Update Record' : 'Add Record'}
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
export default MaintenanceForm;