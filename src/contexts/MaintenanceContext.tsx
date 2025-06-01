
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  date: string;
  type: 'Routine Check' | 'Repair' | 'Preventive' | 'Emergency';
  status: 'Scheduled' | 'In Progress' | 'Completed';
  notes: string;
  cost?: number;
  technician?: string;
}

interface MaintenanceContextType {
  maintenance: MaintenanceRecord[];
  addMaintenance: (maintenance: Omit<MaintenanceRecord, 'id'>) => void;
  updateMaintenance: (id: string, maintenance: Partial<MaintenanceRecord>) => void;
  deleteMaintenance: (id: string) => void;
  getMaintenanceById: (id: string) => MaintenanceRecord | undefined;
  getUpcomingMaintenance: () => MaintenanceRecord[];
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

const initialMaintenance: MaintenanceRecord[] = [
  {
    id: 'm1',
    equipmentId: 'eq1',
    equipmentName: 'Excavator CAT 320',
    date: '2025-05-20',
    type: 'Routine Check',
    status: 'Completed',
    notes: 'No issues found. All systems operational.',
    cost: 150,
    technician: 'John Smith'
  },
  {
    id: 'm2',
    equipmentId: 'eq3',
    equipmentName: 'Scissor Lift',
    date: '2025-06-10',
    type: 'Preventive',
    status: 'Scheduled',
    notes: 'Annual safety inspection and hydraulic system check',
    technician: 'Mike Johnson'
  }
];

export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    const savedMaintenance = localStorage.getItem('maintenance');
    if (savedMaintenance) {
      setMaintenance(JSON.parse(savedMaintenance));
    } else {
      setMaintenance(initialMaintenance);
      localStorage.setItem('maintenance', JSON.stringify(initialMaintenance));
    }
  }, []);

  const saveToStorage = (maintenanceList: MaintenanceRecord[]) => {
    localStorage.setItem('maintenance', JSON.stringify(maintenanceList));
  };

  const addMaintenance = (newMaintenance: Omit<MaintenanceRecord, 'id'>) => {
    const maintenance = {
      ...newMaintenance,
      id: `m${Date.now()}`
    };
    setMaintenance(prev => {
      const updated = [...prev, maintenance];
      saveToStorage(updated);
      return updated;
    });
  };

  const updateMaintenance = (id: string, updates: Partial<MaintenanceRecord>) => {
    setMaintenance(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, ...updates } : m);
      saveToStorage(updated);
      return updated;
    });
  };

  const deleteMaintenance = (id: string) => {
    setMaintenance(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const getMaintenanceById = (id: string) => {
    return maintenance.find(m => m.id === id);
  };

  const getUpcomingMaintenance = () => {
    const today = new Date().toISOString().split('T')[0];
    return maintenance.filter(m => 
      m.status === 'Scheduled' && m.date >= today
    );
  };

  return (
    <MaintenanceContext.Provider value={{
      maintenance,
      addMaintenance,
      updateMaintenance,
      deleteMaintenance,
      getMaintenanceById,
      getUpcomingMaintenance
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
