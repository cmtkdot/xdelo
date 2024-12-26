import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MediaItem } from "@/components/media/types";
import { useToast } from "@/hooks/use-toast";
import { GoogleSheetsConfig } from "@/components/media/GoogleSheetsConfig";
import useMediaSubscription from "@/components/media/hooks/useMediaSubscription";
import { MediaTableContent } from "@/components/media/table/MediaTableContent";
import { useMediaTableSort } from "@/components/media/table/hooks/useMediaTableSort";
import { useMediaTableSelection } from "@/components/media/table/hooks/useMediaTableSelection";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GoogleDriveUploader from "@/components/media/GoogleDriveUploader";

const GOOGLE_CLIENT_ID = "977351558653-ohvqd6j78cbei8aufarbdsoskqql05s1.apps.googleusercontent.com";

const MediaTable = () => {
  const { toast } = useToast();
  const [spreadsheetId, setSpreadsheetId] = useState<string>();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  useMediaSubscription(spreadsheetId);
  
  const { data: mediaItems, isLoading, error } = useQuery({
    queryKey: ['media-table'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        throw new Error('You must be logged in to view media');
      }

      const { data, error } = await supabase
        .from('media')
        .select(`
          *,
          chat:channels(title, username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching media",
          description: error.message,
        });
        throw error;
      }
      
      return data as MediaItem[];
    },
  });

  const { sortedMediaItems, handleSort, sortConfig } = useMediaTableSort(mediaItems);
  const {
    selectedMedia,
    handleToggleSelect,
    handleSelectAll,
    allSelected,
    someSelected,
  } = useMediaTableSelection(mediaItems);

  const openFileInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-center">
        <div className="p-6 max-w-sm mx-auto bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-red-400">Error: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="space-y-6">
        <div className="mb-6">
          <GoogleSheetsConfig onSpreadsheetIdSet={setSpreadsheetId} />
        </div>
        
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-lg overflow-hidden">
          {selectedMedia.length > 0 && (
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <span className="text-white/70">
                {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''} selected
              </span>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Selected to Drive
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Files to Google Drive</DialogTitle>
                  </DialogHeader>
                  <GoogleDriveUploader
                    selectedFiles={selectedMedia}
                    onSuccess={() => setIsUploadDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
          <MediaTableContent
            isLoading={isLoading}
            mediaItems={sortedMediaItems}
            onSort={handleSort}
            onSelectAll={handleSelectAll}
            allSelected={allSelected}
            someSelected={someSelected}
            selectedMedia={selectedMedia}
            onToggleSelect={handleToggleSelect}
            onOpenFile={openFileInNewTab}
            sortConfig={sortConfig}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default MediaTable;