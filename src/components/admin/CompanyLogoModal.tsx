'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Language } from '@/lib/types';
import { Upload, Image as ImageIcon, X, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyLogoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLogoUrl?: string;
  language: Language;
  onLogoUpdated: (logoUrl: string) => void;
}

export function CompanyLogoModal({
  open,
  onOpenChange,
  currentLogoUrl,
  language,
  onLogoUpdated,
}: CompanyLogoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(png|jpg|jpeg|svg\+xml)$/)) {
      toast.error(
        language === 'en'
          ? 'Please select a PNG, JPG, or SVG file'
          : 'Sila pilih fail PNG, JPG, atau SVG'
      );
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        language === 'en'
          ? 'File size must be less than 2MB'
          : 'Saiz fail mesti kurang daripada 2MB'
      );
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Convert file to base64 for API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        setUploadProgress(40);

        // Upload to API
        const response = await fetch('/api/admin/logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64Data,
            filename: selectedFile.name,
            contentType: selectedFile.type,
          }),
        });

        setUploadProgress(80);

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const { logoUrl } = await response.json();
        
        setUploadProgress(100);
        
        toast.success(
          language === 'en'
            ? 'Logo uploaded successfully!'
            : 'Logo berjaya dimuat naik!'
        );

        onLogoUpdated(logoUrl);
        
        // Close modal after short delay
        setTimeout(() => {
          onOpenChange(false);
          setSelectedFile(null);
          setUploadProgress(0);
        }, 1000);
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error(
        language === 'en'
          ? 'Failed to upload logo. Please try again.'
          : 'Gagal memuat naik logo. Sila cuba lagi.'
      );
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(currentLogoUrl || null);
  };

  const handleDeleteLogo = async () => {
    setIsUploading(true);
    try {
      const response = await fetch('/api/admin/logo', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast.success(
        language === 'en'
          ? 'Logo removed successfully'
          : 'Logo berjaya dikeluarkan'
      );

      setPreviewUrl(null);
      onLogoUpdated('');
      onOpenChange(false);
    } catch (error) {
      console.error('Logo delete error:', error);
      toast.error(
        language === 'en'
          ? 'Failed to remove logo'
          : 'Gagal mengeluarkan logo'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {language === 'en' ? 'Company Logo' : 'Logo Syarikat'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en'
              ? 'Upload your company logo for branded reports. Supported formats: PNG, JPG, SVG (max 2MB)'
              : 'Muat naik logo syarikat anda untuk laporan berjenama. Format disokong: PNG, JPG, SVG (maksimum 2MB)'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-full max-w-md aspect-video border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Company Logo Preview"
                    className="max-h-full max-w-full object-contain p-4"
                  />
                  {selectedFile && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'No logo uploaded' : 'Tiada logo dimuat naik'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="logo-upload">
              {language === 'en' ? 'Select Logo File' : 'Pilih Fail Logo'}
            </Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{language === 'en' ? 'Uploading...' : 'Memuat naik...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {currentLogoUrl && !selectedFile && (
            <Button
              variant="destructive"
              onClick={handleDeleteLogo}
              disabled={isUploading}
            >
              {language === 'en' ? 'Remove Logo' : 'Keluarkan Logo'}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            {language === 'en' ? 'Cancel' : 'Batal'}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {language === 'en' ? 'Uploading...' : 'Memuat naik...'}
              </>
            ) : uploadProgress === 100 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Uploaded!' : 'Dimuat naik!'}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Upload' : 'Muat Naik'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
