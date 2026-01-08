import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/services/api';
import { format } from 'date-fns';

// Interface for a booking object from the backend
interface Booking {
  _id: string;
  user: {
    _id: string;
    email: string;
  };
  car: {
    _id: string;
    brand: string;
    model: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  userDetails: {
    firstName: string;
    lastName: string;
  };
}

const BookingsManagementPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/bookings/admin');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings.');
        console.error('Error fetching bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading bookings...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">Bookings Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>A list of all bookings made by users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booked On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">
                      {booking.car.brand} {booking.car.model}
                    </TableCell>
                    <TableCell>
                      {booking.userDetails.firstName} {booking.userDetails.lastName}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.startDate), 'LLL dd, y')} - {format(new Date(booking.endDate), 'LLL dd, y')}
                    </TableCell>
                    <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'destructive'}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(booking.createdAt), 'LLL dd, y')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsManagementPage;
