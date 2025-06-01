
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Rental {
  id: string;
  equipmentId: string;
  customerId: string;
  customerName?: string;
  equipmentName?: string;
  startDate: string;
  endDate: string;
  status: 'Reserved' | 'Active' | 'Returned' | 'Overdue';
  totalAmount?: number;
  notes?: string;
}

interface RentalsContextType {
  rentals: Rental[];
  addRental: (rental: Omit<Rental, 'id'>) => void;
  updateRental: (id: string, rental: Partial<Rental>) => void;
  deleteRental: (id: string) => void;
  getRentalById: (id: string) => Rental | undefined;
  getOverdueRentals: () => Rental[];
}

const RentalsContext = createContext<RentalsContextType | undefined>(undefined);

const initialRentals: Rental[] = [
  {
    id: 'r1',
    equipmentId: 'eq2',
    customerId: '3',
    customerName: 'Customer User',
    equipmentName: 'Concrete Mixer',
    startDate: '2025-05-28',
    endDate: '2025-06-05',
    status: 'Active',
    totalAmount: 960,
    notes: 'Regular rental for construction project'
  },
  {
    id: 'r2',
    equipmentId: 'eq1',
    customerId: '3',
    customerName: 'Customer User',
    equipmentName: 'Excavator CAT 320',
    startDate: '2025-06-01',
    endDate: '2025-06-03',
    status: 'Reserved',
    totalAmount: 1350,
    notes: 'Foundation work project'
  }
];

export const RentalsProvider = ({ children }: { children: ReactNode }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    const savedRentals = localStorage.getItem('rentals');
    if (savedRentals) {
      setRentals(JSON.parse(savedRentals));
    } else {
      setRentals(initialRentals);
      localStorage.setItem('rentals', JSON.stringify(initialRentals));
    }
  }, []);

  const saveToStorage = (rentalsList: Rental[]) => {
    localStorage.setItem('rentals', JSON.stringify(rentalsList));
  };

  const addRental = (newRental: Omit<Rental, 'id'>) => {
    const rental = {
      ...newRental,
      id: `r${Date.now()}`
    };
    setRentals(prev => {
      const updated = [...prev, rental];
      saveToStorage(updated);
      return updated;
    });
  };

  const updateRental = (id: string, updates: Partial<Rental>) => {
    setRentals(prev => {
      const updated = prev.map(rental => rental.id === id ? { ...rental, ...updates } : rental);
      saveToStorage(updated);
      return updated;
    });
  };

  const deleteRental = (id: string) => {
    setRentals(prev => {
      const updated = prev.filter(rental => rental.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const getRentalById = (id: string) => {
    return rentals.find(rental => rental.id === id);
  };

  const getOverdueRentals = () => {
    const today = new Date().toISOString().split('T')[0];
    return rentals.filter(rental => 
      rental.status === 'Active' && rental.endDate < today
    );
  };

  return (
    <RentalsContext.Provider value={{
      rentals,
      addRental,
      updateRental,
      deleteRental,
      getRentalById,
      getOverdueRentals
    }}>
      {children}
    </RentalsContext.Provider>
  );
};

export const useRentals = () => {
  const context = useContext(RentalsContext);
  if (!context) {
    throw new Error('useRentals must be used within a RentalsProvider');
  }
  return context;
};
