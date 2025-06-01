
import React, { useState } from 'react';
import { useRentals } from '../contexts/RentalsContext';
import RentalsList from '../components/Rentals/RentalsList';
import RentalsForm from '../components/Rentals/RentalsForm';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

const RentalsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState(null);

  const handleAddNew = () => {
    setEditingRental(null);
    setShowForm(true);
  };

  const handleEdit = (rental) => {
    setEditingRental(rental);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRental(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rental Orders</h1>
          <p className="text-gray-600">Manage equipment rental orders</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Rental
        </Button>
      </div>

      {showForm ? (
        <RentalsForm
          rental={editingRental}
          onClose={handleFormClose}
        />
      ) : (
        <RentalsList onEdit={handleEdit} />
      )}
    </div>
  );
};

export default RentalsPage;
