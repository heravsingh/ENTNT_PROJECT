
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEquipment } from '../contexts/EquipmentContext';
import { useRentals } from '../contexts/RentalsContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Calendar, User, DollarSign } from 'lucide-react';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEquipmentById } = useEquipment();
  const { rentals } = useRentals();

  const equipment = getEquipmentById(id || '');
  const equipmentRentals = rentals.filter(rental => rental.equipmentId === id);

  if (!equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Equipment not found</p>
        <Button onClick={() => navigate('/equipment')} className="mt-4">
          Back to Equipment
        </Button>
      </div>
    );
  }

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

  const getRentalStatusColor = (status: string) => {
    switch (status) {
      case 'Reserved': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Returned': return 'bg-gray-100 text-gray-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/equipment')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Equipment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {equipment.name}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(equipment.status)}`}></div>
                  <span className="text-sm font-medium">{equipment.status}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-lg">{equipment.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Condition</label>
                  <Badge className={getConditionColor(equipment.condition)}>
                    {equipment.condition}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Daily Rate</label>
                  <p className="text-lg font-semibold">${equipment.dailyRate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-lg">{equipment.location}</p>
                </div>
              </div>
              {equipment.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-700 mt-1">{equipment.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Rentals</p>
                  <p className="text-xl font-bold">{equipmentRentals.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Active Rentals</p>
                  <p className="text-xl font-bold">
                    {equipmentRentals.filter(r => r.status === 'Active').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold">
                    ${equipmentRentals.reduce((sum, rental) => sum + (rental.totalAmount || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rental History */}
      <Card>
        <CardHeader>
          <CardTitle>Rental History</CardTitle>
        </CardHeader>
        <CardContent>
          {equipmentRentals.length > 0 ? (
            <div className="space-y-4">
              {equipmentRentals.map((rental) => (
                <div key={rental.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{rental.customerName}</h4>
                      <p className="text-sm text-gray-600">{rental.customerEmail}</p>
                    </div>
                    <Badge className={getRentalStatusColor(rental.status)}>
                      {rental.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <p className="font-medium">{rental.startDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">End Date:</span>
                      <p className="font-medium">{rental.endDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-medium">${rental.totalAmount}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{rental.customerPhone}</p>
                    </div>
                  </div>
                  {rental.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{rental.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No rental history found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetailPage;
