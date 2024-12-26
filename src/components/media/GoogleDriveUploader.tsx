import { GoogleOAuthProvider } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MediaItem } from "./types";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface GoogleDriveUploaderProps {
  fileUrl?: string;
  fileName?: string;
  selectedFiles?: MediaItem[];
  onSuccess?: () => void;
}

const GOOGLE_CLIENT_ID = "977351558653-ohvqd6j78cbei8aufarbdsoskqql05s1.apps.googleusercontent.com";

const GoogleDriveUploader = ({ fileUrl, fileName, selectedFiles, onSuccess }: GoogleDriveUploaderProps) => {
  const { toast } = useToast();

  const uploadToGoogleDrive = async (accessToken: string) => {
    try {
      if (selectedFiles && selectedFiles.length > 0) {
        const { data, error } = await supabase.functions.invoke('upload-to-drive', {
          body: { 
            files: selectedFiles.map(file => ({
              fileUrl: file.file_url,
              fileName: file.file_name
            })),
            accessToken 
          }
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: `Successfully uploaded ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} to Google Drive`,
        });

        onSuccess?.();
        return data;
      } else if (fileUrl && fileName) {
        const { data, error } = await supabase.functions.invoke('upload-to-drive', {
          body: { fileUrl, fileName, accessToken }
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "File successfully uploaded to Google Drive",
        });

        return data;
      }
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload file(s) to Google Drive. Please try again.",
      });
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      await uploadToGoogleDrive(response.access_token);
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Make sure you're logged into the Google account where you want to upload the file{selectedFiles?.length > 1 ? 's' : ''}.
        </AlertDescription>
      </Alert>
      
      <Button
        onClick={() => login()}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
      >
        <Upload className="w-4 h-4" />
        Upload to Google Drive
      </Button>
    </div>
  );
};

export default GoogleDriveUploader;