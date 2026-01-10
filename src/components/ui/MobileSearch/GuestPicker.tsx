import { useState, useRef, useEffect, useMemo } from "react";
import { MdOutlinePersonOutline } from "react-icons/md";

export interface GuestValue {
  adults: number;
  children: number;
  infants: number;
}

export interface GuestPickerProps {
  value: GuestValue;
  onChange: React.Dispatch<React.SetStateAction<GuestValue>>;
}

const GuestPicker = ({ value, onChange }: GuestPickerProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  
  const buttonRef = useRef<HTMLDivElement | null>(null);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const totalGuests = useMemo(() => {
    const total = value.adults + value.children + value.infants;
    return total || "Guests";
  }, [value]);

  const handleValueUpdate = (
    field: keyof GuestValue,
    operation: "add" | "subtract"
  ) => {
    onChange((prev) => {
      const newValue =
        operation === "add" ? prev[field] + 1 : Math.max(0, prev[field] - 1);
      return { ...prev, [field]: newValue };
    });
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex flex-col w-full h-[42px]">
          <div ref={buttonRef} className="relative h-full">
            <button
              className="w-full h-full bg-white px-3 py-2 flex items-center justify-start text-base text-gray-700 font-normal hover:border-gray-400 rounded-md outline-none focus:border-gray-400 transition-all duration-300"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <i className="mr-3 inline-flex items-center justify-start text-gray-500 text-2xl">
                <MdOutlinePersonOutline className="text-gray-light" />
              </i>
              <div className="flex flex-col justify-start items-start gap-1">
                <span className="text-sm flex text-gray-500">
                  {totalGuests} {typeof totalGuests === "number" && "Guests"}
                </span>
              </div>
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-[100%] sm:left-0 right-0 p-6 z-50 border bg-white rounded-md shadow-md translate-y-1 cursor-default"
                style={{
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              >
                <ul className="space-y-4 min-w-52 w-64">
                  <li className="flex items-center justify-between text-gray-700">
                    <span className="text-base">Adults</span>
                    <div className="inline-flex items-center gap-4">
                      <button
                        className={`inline-flex items-center justify-center p-1 border rounded-full transition-all duration-300 ${
                          value.adults === 0
                            ? "border-blue-200 text-blue-200"
                            : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                        }`}
                        type="button"
                        onClick={() => handleValueUpdate("adults", "subtract")}
                        disabled={value.adults === 0}
                      >
                        <i className="inline-flex items-center justify-center">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </i>
                      </button>
                      <span className="inline-block min-w-7 text-blue-600 font-medium text-center">
                        {value.adults}
                      </span>
                      <button
                        className="inline-flex items-center justify-center p-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
                        type="button"
                        onClick={() => handleValueUpdate("adults", "add")}
                      >
                        <i className="inline-flex items-center justify-center">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </i>
                      </button>
                    </div>
                  </li>

                  <li className="flex items-center justify-between text-gray-700">
                    <span className="text-base">Children</span>
                    <div className="inline-flex items-center gap-4">
                      <button
                        className={`inline-flex items-center justify-center p-1 border rounded-full transition-all duration-300 ${
                          value.children === 0
                            ? "border-blue-200 text-blue-200"
                            : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                        }`}
                        type="button"
                        onClick={() =>
                          handleValueUpdate("children", "subtract")
                        }
                        disabled={value.children === 0}
                      >
                        <i className="inline-flex items-center justify-center">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </i>
                      </button>
                      <span className="inline-block min-w-7 text-blue-600 font-medium text-center">
                        {value.children}
                      </span>
                      <button
                        className="inline-flex items-center justify-center p-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
                        type="button"
                        onClick={() => handleValueUpdate("children", "add")}
                      >
                        <i className="inline-flex items-center justify-center">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </i>
                      </button>
                    </div>
                  </li>

                  <li className="flex items-center justify-between text-gray-700">
                    <span className="text-base">Infants</span>
                    <div className="inline-flex items-center gap-4">
                      <button
                        className={`inline-flex items-center justify-center p-1 border rounded-full transition-all duration-300 ${
                          value.infants === 0
                            ? "border-blue-200 text-blue-200"
                            : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                        }`}
                        type="button"
                        onClick={() => handleValueUpdate("infants", "subtract")}
                        disabled={value.infants === 0}
                      >
                        <i className="inline-flex items-center justify-center">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </i>
                      </button>
                      <span className="inline-block min-w-7 text-blue-600 font-medium text-center">
                        {value.infants}
                      </span>
                      <button
                        className="inline-flex items-center justify-center p-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
                        type="button"
                        onClick={() => handleValueUpdate("infants", "add")}
                      >
                        <i className="inline-flex items-center justify-center">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </i>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestPicker;
