'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Language } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  participantName: string;
  language: Language;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  participantName,
  language,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {language === 'en' ? 'Delete Participant?' : 'Padam Peserta?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {language === 'en' 
                ? `Are you sure you want to permanently delete ${participantName} and all their assessment data?`
                : `Adakah anda pasti mahu memadam ${participantName} dan semua data penilaian mereka secara kekal?`}
            </p>
            <p className="text-red-600 dark:text-red-400 font-medium">
              {language === 'en'
                ? '⚠️ This action cannot be undone. All responses, results, and personal information will be permanently deleted.'
                : '⚠️ Tindakan ini tidak boleh dibatalkan. Semua respons, keputusan, dan maklumat peribadi akan dipadam secara kekal.'}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {language === 'en' ? 'Cancel' : 'Batal'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              language === 'en' ? 'Deleting...' : 'Memadam...'
            ) : (
              language === 'en' ? 'Yes, Delete' : 'Ya, Padam'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
