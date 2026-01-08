import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { format } from 'date-fns';

// User interface from the backend
interface User {
  _id: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

// Edit Modal Component
const UserEditModal: React.FC<{
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ user, isOpen, onClose, onSuccess }) => {
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsAdmin(user.isAdmin);
  }, [user]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.put(`/users/admin/${user._id}`, { isAdmin });
      onSuccess();
    } catch (error: any) {
      alert(`Failed to update user: ${error.response?.data?.message || 'Server error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogDescription>Modify the admin status for {user.email}.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdmin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(!!checked)}
            />
            <Label htmlFor="isAdmin" className="text-base">
              Assign as Administrator
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Admins have full access to manage cars, bookings, and users.
          </p>
        </div>
        <div className="flex justify-end gap-2">
           <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
           <Button onClick={handleSubmit} disabled={isSubmitting}>
             {isSubmitting ? 'Saving...' : 'Save Changes'}
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/admin');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchUsers(); // Refresh the user list after an update
  };

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Registered Users</CardTitle>
          <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge>Admin</Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'LLL dd, y')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
                      Edit Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
