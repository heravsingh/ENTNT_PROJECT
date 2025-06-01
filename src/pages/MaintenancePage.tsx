
import React, { useState } from 'react';
import { useMaintenance } from '../contexts/MaintenanceContext';
import MaintenanceList from '../components/Maintenance/MaintenanceList';
import MaintenanceForm from '../components/Maintenance/MaintenanceForm';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

const MaintenancePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);

  const handleAddNew = () => {
    setEditingMaintenance(null);
    setShowForm(true);
  };

  const handleEdit = (maintenance) => {
    setEditingMaintenance(maintenance);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMaintenance(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Records</h1>
          <p className="text-gray-600">Manage equipment maintenance and servicing</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Maintenance
        </Button>
      </div>

      {showForm ? (
        <MaintenanceForm
          maintenance={editingMaintenance}
          onClose={handleFormClose}
        />
      ) : (
        <MaintenanceList onEdit={handleEdit} />
      )}
    </div>
  );
};

export default MaintenancePage;
