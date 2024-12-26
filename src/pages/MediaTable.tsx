import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MediaItem } from "@/components/media/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MediaTableHeader } from "@/components/media/table/MediaTableHeader";
import { MediaTableRow } from "@/components/media/table/MediaTableRow";
import { GoogleSheetsConfig } from "@/components/media/GoogleSheetsConfig";
import useMediaSubscription from "@/components/media/hooks/useMediaSubscription";
import { Loader2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOOGLE_CLIENT_ID = "977351558653-ohvqd6j78cbei8aufarbdsoskqql05s1.apps.googleusercontent.com";

type SortConfig = {
  column: keyof MediaItem | null;
  direction: 'asc' | 'desc';
};

const MediaTable = () => {
  const { toast } = useToast();
  const [spreadsheetId, setSpreadsheetId] = useState<string>();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const lastSelectedIndex = useRef<number>(-1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: 'desc' });
  
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

  const handleToggleSelect = (item: MediaItem, index: number, event?: React.MouseEvent) => {
    setSelectedMedia(prev => {
      let newSelection = [...prev];
      const isSelected = prev.some(media => media.id === item.id);

      if (event?.shiftKey && lastSelectedIndex.current !== -1 && mediaItems) {
        // Handle shift+click for range selection
        const start = Math.min(lastSelectedIndex.current, index);
        const end = Math.max(lastSelectedIndex.current, index);
        const itemsInRange = mediaItems.slice(start, end + 1);
        
        if (isSelected) {
          // If the clicked item was selected, remove the range
          newSelection = newSelection.filter(
            media => !itemsInRange.some(rangeItem => rangeItem.id === media.id)
          );
        } else {
          // If the clicked item wasn't selected, add the range
          itemsInRange.forEach(rangeItem => {
            if (!newSelection.some(media => media.id === rangeItem.id)) {
              newSelection.push(rangeItem);
            }
          });
        }
      } else if (event?.ctrlKey || event?.metaKey) {
        // Handle ctrl/cmd+click for individual toggle
        if (isSelected) {
          newSelection = newSelection.filter(media => media.id !== item.id);
        } else {
          newSelection.push(item);
        }
      } else {
        // Normal click - replace selection
        newSelection = isSelected ? [] : [item];
      }

      lastSelectedIndex.current = index;
      return newSelection;
    });
  };

  const openFileInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSort = (column: keyof MediaItem) => {
    setSortConfig(prevConfig => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedMediaItems = mediaItems ? [...mediaItems].sort((a, b) => {
    if (!sortConfig.column) return 0;

    let aValue = a[sortConfig.column];
    let bValue = b[sortConfig.column];

    // Handle nested chat object for channel title
    if (sortConfig.column === 'chat_id') {
      aValue = a.chat?.title || '';
      bValue = b.chat?.title || '';
    }

    // Handle date strings
    if (sortConfig.column === 'created_at') {
      return sortConfig.direction === 'asc' 
        ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
        : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
    }

    // Handle strings and other types
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }) : [];

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-center">
        <div className="p-6 max-w-sm mx-auto bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-red-400">Error: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const renderSortButton = (column: keyof MediaItem, label: string) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(column)}
      className="h-8 flex items-center gap-1 px-2 hover:bg-white/5"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="space-y-6">
        <MediaTableHeader selectedMedia={selectedMedia} />
        
        <div className="mb-6">
          <GoogleSheetsConfig onSpreadsheetIdSet={setSpreadsheetId} />
        </div>
        
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-16rem)]" type="always">
              <div className="min-w-[1400px]">
                <Table>
                  <TableHeader className="bg-black/60 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="text-sky-400 w-[100px]">Select</TableHead>
                      <TableHead className="text-sky-400 w-[150px]">
                        {renderSortButton('media_type', 'Type')}
                      </TableHead>
                      <TableHead className="text-sky-400 w-[150px]">
                        {renderSortButton('chat_id', 'Channel')}
                      </TableHead>
                      <TableHead className="text-sky-400 w-[200px]">
                        {renderSortButton('created_at', 'Created At')}
                      </TableHead>
                      <TableHead className="text-sky-400 w-[300px]">
                        {renderSortButton('caption', 'Caption')}
                      </TableHead>
                      <TableHead className="text-sky-400 w-[400px]">
                        {renderSortButton('file_url', 'File URL')}
                      </TableHead>
                      <TableHead className="text-sky-400 text-right w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMediaItems?.map((item, index) => (
                      <MediaTableRow
                        key={item.id}
                        item={item}
                        onOpenFile={openFileInNewTab}
                        isSelected={selectedMedia.some(media => media.id === item.id)}
                        onToggleSelect={(e) => handleToggleSelect(item, index, e)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default MediaTable;