import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Icon from "@/components/ui/Icon"; // Assuming your custom Icon component is here

interface ImageCarouselTypes {
  imageSrc: (string | undefined)[];
}

const ImageCarousel = ({ imageSrc }: ImageCarouselTypes) => {
  return (
    <div className="px-2 sm:px-8 gap-4 sm:gap-14 w-[360px] sm:w-[41rem] overflow-hidden flex flex-col">
      <div className="">
        <Carousel className="w-full flex  justify-center items-center max-w-full px-4 sm:px-24">
          <CarouselContent>
            {imageSrc?.map((image, index) => (
              <CarouselItem
                key={index}
                className="w-[10rem] sm:w-[16rem] h-[8rem] sm:h-[15rem] rounded-md flex-shrink-0"
              >
                <img
                  src={image}
                  className="w-full h-full object-cover rounded-md"
                  alt="hotel"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom Previous Button */}
          <CarouselPrevious className="border-none overflow-auto flex justify-center items-center ml-2 sm:ml-4 pl-1 sm:pl-2 hover:bg-gray-light h-8 w-8 sm:h-10 sm:w-10">
            <Icon
              name="arrow_back_ios"
              className="text-black text-sm sm:text-base"
              iconSymbolType="material-icons"
            />
          </CarouselPrevious>

          {/* Custom Next Button */}
          <CarouselNext className="border-none flex justify-center items-center mr-2 sm:mr-4 pl-1 hover:bg-gray-light h-8 w-8 sm:h-10 sm:w-10">
            <Icon
              name="arrow_forward_ios"
              className="text-black text-sm sm:text-base"
            />
          </CarouselNext>
        </Carousel>
      </div>

      {/* Below Images */}
      <div className="flex w-full overflow-auto gap-2 pb-1">
        {imageSrc?.map((image, index) => (
          <div
            key={index}
            className="w-[6rem] sm:w-[9rem] h-[4.5rem] sm:h-[6rem] rounded-[0.25rem] bg-gray-200 flex-shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="hotel"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
