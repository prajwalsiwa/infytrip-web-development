/* eslint-disable react-hooks/exhaustive-deps */
import { MdLocationOn, MdDateRange, MdOutlinePerson } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useRef, useMemo } from "react";
import { format } from "date-fns";
import Icon from "@/components/ui/Icon";
import { useSearchParams } from "react-router-dom";

interface MobileSearchProps {
  className?: string;
}

function MobileSearch({ className }: MobileSearchProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();

  /* ------------------ Location ------------------ */
  const locationValue = searchParams.get("city") ?? "Where are you going";

  /* ------------------ Dates ------------------ */
  const checkinParam = searchParams.get("checkin_date");
  const checkoutParam = searchParams.get("checkout_date");

  const checkinDate = checkinParam ? new Date(checkinParam) : null;
  const checkoutDate = checkoutParam ? new Date(checkoutParam) : null;

  const dateLabel = useMemo(() => {
    if (!checkinDate || !checkoutDate) return "Pick Dates";

    return `${format(checkinDate, "LLL dd")} - ${format(
      checkoutDate,
      "LLL dd"
    )}`;
  }, [checkinDate, checkoutDate]);

  /* ------------------ Guests ------------------ */
  const guests = useMemo(() => {
    const adults = Number(searchParams.get("adults") ?? 0);
    const children = Number(searchParams.get("children") ?? 0);
    const infants = Number(searchParams.get("infants") ?? 0);

    const total = adults + children + infants;
    return `${total || 0} Guests`;
  }, [searchParams]);

  return (
    <div className={cn("w-full border rounded-sm py-1 px-1 mt-2", className)}>
      <div className="flex items-center gap-2">
        <div>
          <Icon name="arrow_back" className="text-gray-dark" />
        </div>

        <div className="flex flex-col gap-1">
          {/* Location */}
          <div className="w-full flex items-center px-2 rounded">
            <MdLocationOn className="text-gray mr-2" />
            <span className="text-gray">{locationValue}</span>
          </div>

          <div className="flex w-fit">
            {/* Dates */}
            <div className="w-64">
              <div className="w-full flex items-center px-2">
                <MdDateRange className="text-gray mr-2" />
                <span className="text-gray">{dateLabel}</span>
              </div>
            </div>

            {/* Guests */}
            <div ref={buttonRef} className="relative flex-grow w-full">
              <div className="w-full flex items-center px-2">
                <MdOutlinePerson className="text-gray mr-2" />
                <span className="text-gray">{guests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileSearch;
