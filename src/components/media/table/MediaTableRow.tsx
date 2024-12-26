import { format } from "date-fns";
import { Link2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { MediaItem } from "../types";
import { MediaTableActions } from "./MediaTableActions";
import { Checkbox } from "@/components/ui/checkbox";

interface MediaTableRowProps {
  item: MediaItem;
  onOpenFile: (url: string) => void;
  isSelected: boolean;
  onToggleSelect: (e?: React.MouseEvent) => void;
  onDelete: () => void;
}

export const MediaTableRow = ({ 
  item, 
  onOpenFile, 
  isSelected,
  onToggleSelect,
  onDelete
}: MediaTableRowProps) => {
  // Prioritize Google Drive URL if available
  const fileUrl = item.google_drive_url || item.file_url;
  
  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent row click when clicking on buttons or links
    if (
      e.target instanceof HTMLElement && 
      (e.target.closest('button') || e.target.closest('a'))
    ) {
      return;
    }
    
    // Create a synthetic event with ctrl key pressed to maintain selection
    const syntheticEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true, // Always use ctrl key behavior for single clicks
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
    });
    
    onToggleSelect(syntheticEvent as unknown as React.MouseEvent);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    // Create a synthetic mouse event with the same modifiers
    const syntheticEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true, // Always use ctrl key behavior for checkboxes
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
    });
    
    onToggleSelect(syntheticEvent as unknown as React.MouseEvent);
  };

  // Extract message ID from metadata if available
  const messageId = item.metadata?.message_id;

  return (
    <TableRow 
      className={`hover:bg-white/5 cursor-pointer ${isSelected ? 'bg-white/10' : ''}`}
      onClick={handleRowClick}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div onClick={handleCheckboxClick}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => {}}
            className="bg-white/20 border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
        </div>
      </TableCell>
      <TableCell className="text-white/70 whitespace-nowrap">{item.media_type}</TableCell>
      <TableCell className="text-white/70 whitespace-nowrap">{item.chat?.title || 'N/A'}</TableCell>
      <TableCell className="text-white/70 whitespace-nowrap">
        {item.created_at ? format(new Date(item.created_at), 'PPpp') : 'N/A'}
      </TableCell>
      <TableCell className="text-white/70">
        <div className="max-w-[300px] truncate">
          {item.caption || 'No caption'}
        </div>
      </TableCell>
      <TableCell className="text-white/70">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenFile(fileUrl);
          }}
          className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors group"
        >
          <Link2 className="w-4 h-4 flex-shrink-0" />
          <span className="truncate max-w-[300px] group-hover:underline">
            {fileUrl}
          </span>
        </button>
      </TableCell>
      <TableCell>
        <MediaTableActions
          id={item.id}
          fileUrl={item.file_url}
          fileName={item.file_name}
          chatId={item.chat_id}
          messageId={messageId}
          onView={() => onOpenFile(fileUrl)}
          hasGoogleDrive={!!item.google_drive_url}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};