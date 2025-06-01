
import React, { useState } from 'react';
import { useEquipment } from '../contexts/EquipmentContext';
import EquipmentList from '../components/Equipment/EquipmentList';
import EquipmentForm from '../components/Equipment/EquipmentForm';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

const EquipmentPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const handleAddNew = () => {
    setEditingEquipment(null);
    setShowForm(true);
  };

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEquipment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Inventory</h1>
          <p className="text-gray-600">Manage your equipment fleet</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      {showForm ? (
        <EquipmentForm
          equipment={editingEquipment}
          onClose={handleFormClose}
        />
      ) : (
        <EquipmentList onEdit={handleEdit} />
      )}
    </div>
  );
};

export default EquipmentPage;