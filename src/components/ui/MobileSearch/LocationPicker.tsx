import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNameSuggestionsQuery } from "@/redux/services/homeApi";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { MdLocationOn } from "react-icons/md";

interface LocationPickerProps {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

function LocationPicker({
  selectedValue,
  setSelectedValue,
}: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(value);
    }, 300);
    return () => clearTimeout(handler);
  }, [value]);

  const { data, isLoading } = useNameSuggestionsQuery(debouncedInput, {
    skip: debouncedInput.length < 2,
  });

  const hotelData = data?.hotelData || [];
  const locationData = data?.locationData || [];

  const suggestions = [
    ...hotelData.map((hotel) => ({
      label: `${hotel.name}, ${hotel.location.city}`,
      value: `${hotel.name}, ${hotel.location.city}`,
    })),
    ...locationData.map((loc) => ({
      label: `${loc.name}, ${loc.location.city}`,
      value: `${loc.name}, ${loc.location.city}`,
    })),
  ];

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue);
    }
  }, [selectedValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(" !w-full h-fit rounded-md")}
        >
          <div className="bg-white rounded-md  px-2 flex items-center justify-start gap-2 w-full">
            <MdLocationOn className="size-5 text-gray mt-[2px]" />
            <div className="text-start h-11 rounded-sm w-full items-center flex">
              <p
                className={`text-sm ${
                  selectedValue ? "text-gray-900" : "text-gray-light"
                }`}
              >
                {selectedValue || "Select Location"}
              </p>
            </div>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-full sm:w-96 md:w-[28rem] p-0">
        <Command>
          <CommandInput
            placeholder="Search location..."
            value={value}
            onValueChange={(val) => setValue(val)}
          />
          <CommandList>
            {isLoading && <p className="px-3 py-2 text-sm">Loading...</p>}
            <CommandEmpty>No suggestions Found.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setSelectedValue(currentValue);
                    setValue(""); // reset input (important UX)
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default LocationPicker;
