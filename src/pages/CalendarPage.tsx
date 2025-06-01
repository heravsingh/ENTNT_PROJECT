
import React, { useState } from 'react';
import { useRentals } from '../contexts/RentalsContext';
import { Calendar } from '../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { format, isSameDay, parseISO } from 'date-fns';

const CalendarPage = () => {
  const { rentals } = useRentals();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getRentalsForDate = (date: Date) => {
    return rentals.filter(rental => {
      const startDate = parseISO(rental.startDate);
      const endDate = parseISO(rental.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const selectedDateRentals = selectedDate ? getRentalsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reserved': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Returned': return 'bg-gray-100 text-gray-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Create modifiers for days with rentals
  const rentalDays = rentals.reduce((acc, rental) => {
    const startDate = parseISO(rental.startDate);
    const endDate = parseISO(rental.endDate);
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      acc.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return acc;
  }, [] as Date[]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rental Calendar</h1>
        <p className="text-gray-600">View and manage rental schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                hasRentals: rentalDays
              }}
              modifiersStyles={{
                hasRentals: { backgroundColor: '#dbeafe', fontWeight: 'bold' }
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Rentals for {selectedDate ? format(selectedDate, 'PPP') : 'Selected Date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateRentals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No rentals scheduled for this date</p>
            ) : (
              <div className="space-y-3">
                {selectedDateRentals.map((rental) => (
                  <div key={rental.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{rental.equipmentName}</h4>
                      <Badge className={getStatusColor(rental.status)}>
                        {rental.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Customer: {rental.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {rental.startDate} to {rental.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
