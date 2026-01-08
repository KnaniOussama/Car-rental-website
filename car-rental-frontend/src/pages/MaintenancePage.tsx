import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import api from '@/services/api';
import { format } from 'date-fns';

// Interfaces
interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  totalKilometers: number;
  kilometersSinceLastMaintenance: number;
  status: string;
}

interface MaintenanceLog {
    _id: string;
    date: string;
    description: string;
    cost: number;
}

const MAINTENANCE_THRESHOLD = 10000; // 10,000 km

// Maintenance Log Modal Component
const MaintenanceLogModal: React.FC<{
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ car, isOpen, onClose, onSuccess }) => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchLogs = async () => {
        const response = await api.get(`/maintenance/${car._id}`);
        setLogs(response.data);
      };
      fetchLogs();
    }
  }, [isOpen, car]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/maintenance/${car._id}`, { description, cost: Number(cost) });
      onSuccess();
    } catch (error) {
      alert('Failed to add maintenance log.');
    } finally {
      setIsSubmitting(false);
      setDescription('');
      setCost('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Maintenance for {car.brand} {car.model}</DialogTitle>
          <DialogDescription>Log a new maintenance action and view past history.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <h4 className="font-semibold">New Maintenance Log</h4>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Oil change, tire rotation" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input id="cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g., 150.00" />
                </div>
                <Button onClick={handleSubmit} disabled={isSubmitting || !description}>
                    {isSubmitting ? 'Logging...' : 'Log and Reset KM'}
                </Button>
            </div>
            <div className="space-y-4">
                 <h4 className="font-semibold">Maintenance History</h4>
                 <ScrollArea className="h-60 w-full rounded-md border p-4">
                    {logs.length > 0 ? (
                        <ul className="space-y-3">
                            {logs.map(log => (
                                <li key={log._id} className="text-sm">
                                    <p className="font-medium">{log.description} <span className="text-muted-foreground">- ${log.cost.toFixed(2)}</span></p>
                                    <p className="text-xs text-muted-foreground">{format(new Date(log.date), 'LLL dd, yyyy')}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-center text-muted-foreground">No maintenance history found.</p>
                    )}
                 </ScrollArea>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const MaintenanceManagementPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars/admin');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCars().finally(() => setIsLoading(false));
  }, []);

  const openLogModal = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };
  
  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchCars();
  };

  const sortedCars = useMemo(() => {
    return [...cars].sort((a, b) => b.kilometersSinceLastMaintenance - a.kilometersSinceLastMaintenance);
  }, [cars]);

  if (isLoading) {
    return <div className="p-4">Loading maintenance data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">Fleet Maintenance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Status</CardTitle>
          <CardDescription>Overview of all cars and their maintenance needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>KM Since Maintenance</TableHead>
                <TableHead className="w-[250px]">Maintenance Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCars.map((car) => {
                const progress = Math.min((car.kilometersSinceLastMaintenance / MAINTENANCE_THRESHOLD) * 100, 100);
                const needsMaintenance = car.kilometersSinceLastMaintenance >= MAINTENANCE_THRESHOLD;
                return (
                  <TableRow key={car._id} className={needsMaintenance ? 'bg-red-500/10' : ''}>
                    <TableCell className="font-medium">{car.brand} {car.model}</TableCell>
                    <TableCell>{car.kilometersSinceLastMaintenance.toLocaleString()} km</TableCell>
                    <TableCell>
                      <Progress value={progress} className="w-full" />
                    </TableCell>
                    <TableCell>{car.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openLogModal(car)}>
                        View & Log
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedCar && (
        <MaintenanceLogModal
          car={selectedCar}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default MaintenanceManagementPage;
