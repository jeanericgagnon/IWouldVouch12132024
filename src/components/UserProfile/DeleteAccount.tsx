import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from 'react-hot-toast';

export function DeleteAccount() {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmationCode, setDeleteConfirmationCode] = useState('');

  const handleDeleteAccount = async () => {
    try {
      if (deleteConfirmationCode === 'DELETE') {
        // In a real app, this would call your API to delete the account
        toast.success('Account successfully deleted');
        // Redirect to home page or login page after deletion
        window.location.href = '/';
      } else {
        toast.error('Incorrect confirmation code');
      }
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirmation(true)}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <AlertDialog 
        open={showDeleteConfirmation && deleteStep === 1} 
        onOpenChange={() => setShowDeleteConfirmation(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setDeleteStep(2)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteStep === 2} onOpenChange={() => setDeleteStep(1)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Account Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Please type "DELETE" to confirm that you want to permanently delete your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={deleteConfirmationCode}
            onChange={(e) => setDeleteConfirmationCode(e.target.value)}
            placeholder="Type DELETE here"
            className="my-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteStep(1)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmationCode !== 'DELETE'}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}