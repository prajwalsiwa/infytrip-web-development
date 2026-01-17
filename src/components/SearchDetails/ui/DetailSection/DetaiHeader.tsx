import Icon from "@/components/ui/Icon";
import { useState, ReactNode } from "react";
import ShareModal from "./ShareModal";

interface DetailHeaderProps {
  title?: string;
  location?: string;
  ratings?: number;
  reviews?: number;
  onShare?: () => void;
  onSave?: () => void;
  additionalActions?: ReactNode;
}

export default function DetailHeader({
  title,
  location,
  ratings,
  reviews,
  onShare,
  onSave,
  additionalActions,
}: DetailHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = () => {
    setIsOpen(true);
    onShare?.();
  };

  const handleSave = () => {
    onSave?.();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="hotel-header flex flex-col w-full gap-3 sm:gap-2 mt-3 sm:mt-0">
      <div className="title">
        <span className="font-semibold text-lg sm:text-2xl leading-tight sm:leading-[1.815625rem] text-primary-dark">
          {title}
        </span>
      </div>
      <div className="flex justify-between flex-col sm:flex-row gap-2 sm:gap-4 w-full">
        <div className="location items-center flex flex-wrap h-full gap-1 sm:gap-2 text-sm sm:text-base">
          <div className="flex items-center gap-1">
            <Icon
              name="location_on"
              className="text-gray-dark text-sm sm:text-base"
              iconSymbolType="material-icons"
            />
            <span>{location}</span>
          </div>
          <span className="font-extrabold text-xs">.</span>
          <div className="ratings items-center flex gap-1 sm:gap-2">
            <Icon
              name="star"
              className="text-gray-dark text-sm sm:text-base"
              iconSymbolType="material-icons"
            />
            <span>{ratings}</span>
            <span className="font-extrabold text-xs">.</span>
            <span>
              <a href="" className="underline text-xs sm:text-base">
                {reviews} Reviews
              </a>
            </span>
          </div>
        </div>
        <div className="items-center flex gap-3 sm:gap-4 text-sm sm:text-base flex-wrap">
          <div
            className="flex gap-1 items-center cursor-pointer hover:opacity-70 transition-opacity"
            onClick={handleShare}
          >
            <Icon
              name="share"
              iconSymbolType="material-icons"
              className="text-sm sm:text-base"
            />
            <span className="hidden sm:inline">Share</span>
          </div>
          <div
            className="items-center flex gap-1 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={handleSave}
          >
            <Icon name="favorite" className="text-sm sm:text-base" />
            <span className="hidden sm:inline">Save</span>
          </div>
          {additionalActions}
        </div>
      </div>
      <ShareModal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}
