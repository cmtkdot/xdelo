import { Image, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaGalleryHeaderProps {
  onSyncCaptions: () => void;
  onDeleteDuplicates: () => void;
  isSyncingCaptions: boolean;
  isDeletingDuplicates: boolean;
}

const MediaGalleryHeader = ({
  onSyncCaptions,
  onDeleteDuplicates,
  isSyncingCaptions,
  isDeletingDuplicates
}: MediaGalleryHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Image className="w-6 h-6 text-[#0088cc]" />
        <h2 className="text-xl font-semibold text-white">Media Gallery</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSyncCaptions}
          disabled={isSyncingCaptions}
          className="text-xs"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncingCaptions ? 'animate-spin' : ''}`} />
          Sync Captions
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteDuplicates}
          disabled={isDeletingDuplicates}
          className="text-xs"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Duplicates
        </Button>
      </div>
    </div>
  );
};

export default MediaGalleryHeader;