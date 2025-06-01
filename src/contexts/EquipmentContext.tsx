
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  status: 'Available' | 'Rented' | 'Maintenance' | 'Out of Service';
  description?: string;
  dailyRate?: number;
  location?: string;
}

interface EquipmentContextType {
  equipment: Equipment[];
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

const initialEquipment: Equipment[] = [
  {
    id: 'eq1',
    name: 'Excavator CAT 320',
    category: 'Heavy Machinery',
    condition: 'Good',
    status: 'Available',
    description: 'Medium-sized excavator suitable for construction projects',
    dailyRate: 450,
    location: 'Warehouse A'
  },
  {
    id: 'eq2',
    name: 'Concrete Mixer',
    category: 'Construction',
    condition: 'Excellent',
    status: 'Rented',
    description: 'Portable concrete mixer for small to medium projects',
    dailyRate: 120,
    location: 'Warehouse B'
  },
  {
    id: 'eq3',
    name: 'Scissor Lift',
    category: 'Lifting Equipment',
    condition: 'Good',
    status: 'Available',
    description: 'Electric scissor lift with 26ft reach',
    dailyRate: 280,
    location: 'Warehouse A'
  },
  {
    id: 'eq4',
    name: 'Scissor Lift',
    category: 'Lifting Equipment',
    condition: 'Good',
    status: 'Out of Service',
    description: 'Electric scissor lift with 26ft reach',
    dailyRate: 280,
    location: 'Warehouse A'
  },

];

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const savedEquipment = localStorage.getItem('equipment');
    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment));
    } else {
      setEquipment(initialEquipment);
      localStorage.setItem('equipment', JSON.stringify(initialEquipment));
    }
  }, []);

  const saveToStorage = (equipmentList: Equipment[]) => {
    localStorage.setItem('equipment', JSON.stringify(equipmentList));
  };

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const equipment = {
      ...newEquipment,
      id: `eq${Date.now()}`
    };
    setEquipment(prev => {
      const updated = [...prev, equipment];
      saveToStorage(updated);
      return updated;
    });
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => {
      const updated = prev.map(eq => eq.id === id ? { ...eq, ...updates } : eq);
      saveToStorage(updated);
      return updated;
    });
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => {
      const updated = prev.filter(eq => eq.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const getEquipmentById = (id: string) => {
    return equipment.find(eq => eq.id === id);
  };

  return (
    <EquipmentContext.Provider value={{
      equipment,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      getEquipmentById
    }}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};
