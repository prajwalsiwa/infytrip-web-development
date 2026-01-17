import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageCarousel from "./ImageCarousel";

interface SingerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: (string | undefined)[];
}

function ImageCarouselModal({ isOpen, onClose, imageSrc }: SingerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[44rem] md:max-w-[44rem] w-[95vw] sm:w-auto gap-3 sm:gap-6 p-3 sm:p-6 ">
        <DialogHeader>
          <DialogTitle className="text-gray-dark text-lg sm:text-xl">
            The Chancery Pavillion Hotel
          </DialogTitle>
        </DialogHeader>

        {/* Singer Image Slider */}
        <div className="py-2 sm:py-4">
          <ImageCarousel imageSrc={imageSrc} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageCarouselModal;
