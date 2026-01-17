import { useNavigate } from "react-router-dom";
import CheckInOut from "./CheckInOut";
import GuestPicker from "./GuestPicker";
import LocationPicker from "./LocationPicker";
import { useCallback, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

function MobileSearch() {
  const [selectedValue, setSelectedValue] = useState("");
  const [guestValues, setGuestValues] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });

  const defaultDateRange = useMemo(
    () => ({
      from: addDays(new Date(), 1),
      to: addDays(new Date(), 2),
    }),
    []
  );

  const handleGuestChange = useCallback(
    (
      updatedValues: React.SetStateAction<{
        adults: number;
        children: number;
        infants: number;
      }>
    ) => {
      setGuestValues(updatedValues);
    },
    []
  );

  const [date, setDate] = useState<DateRange | undefined>(defaultDateRange);
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    const city = selectedValue?.split(", ").pop() || "";

    // Format dates - ensure they exist before formatting
    const checkin_date = date?.from ? format(date.from, "yyyy-MM-dd") : "";
    const checkout_date = date?.to ? format(date.to, "yyyy-MM-dd") : "";

    // Create URL parameters
    const params = new URLSearchParams({
      tab: "stays",
      city,
      checkin_date,
      checkout_date,
      adults: guestValues.adults.toString(),
      children: guestValues.children.toString(),
      infants: guestValues.infants.toString(),
    });

    // Navigate to search page with parameters
    navigate(`/search/hotel-list?${params.toString()}`);
  }, [selectedValue, date, guestValues, navigate]);

  return (
    <div className="!w-full flex flex-col gap-4 ">
      <LocationPicker
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
      <CheckInOut date={date} setDate={setDate} />
      {/* COMMENTED OUT FOR PRE-LAUNCH (STAYS ONLY) */}
      {/* {activeTab !== "packages" && ( */}
      <GuestPicker value={guestValues} onChange={handleGuestChange} />
      {/* )} */}
      <div>
        <button
          className="bg-primary text-white px-6 rounded-r-md !w-full py-3 rounded-sm mt-3"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default MobileSearch;
