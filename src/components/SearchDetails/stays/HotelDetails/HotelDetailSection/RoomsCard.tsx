/* eslint-disable @typescript-eslint/no-explicit-any */
import Icon from "@/components/ui/Icon";
import { OptionSelector } from "./OptionSelector";
import { Button } from "@/components/ui/button";
import ServiceContainer from "../../Card/ServiceContainer";
import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  setNumberOfRooms,
  setPendingBooking,
} from "@/redux/features/staysSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContinueBookingMutation } from "@/redux/services/staysApi";

interface Service {
  icon: string;
  text: string | number;
}

interface RoomsCardProps {
  id: number;
  roomName: string;
  price: number;
  discountedPrice?: number;
  amenities: string[];
  services: Service[];
  imageUrl: string;
  roomLength?: number;
  bookRef: any;
}

function RoomsCard({
  bookRef,
  id,
  roomName,
  price,
  discountedPrice,
  amenities,
  services,
  imageUrl,
  roomLength,
}: RoomsCardProps) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [selectedRoomLength, setSelectedRoomLength] = useState<
    number | undefined
  >(1);

  // Get guest params
  const adultsParam = Number(searchParams.get("adults") ?? 0);
  const childrenParam = Number(searchParams.get("children") ?? 0);
  const infantsParam = Number(searchParams.get("infants") ?? 0);

  // Get date params
  const checkinParam = searchParams.get("checkin_date");
  const checkoutParam = searchParams.get("checkout_date");

  // Calculate total guests
  const totalGuests = useMemo(() => {
    if (adultsParam === 0 && childrenParam === 0 && infantsParam === 0) {
      return "Guests";
    }
    const parts = [];
    if (adultsParam > 0)
      parts.push(`${adultsParam} adult${adultsParam > 1 ? "s" : ""}`);
    if (childrenParam > 0)
      parts.push(`${childrenParam} child${childrenParam > 1 ? "ren" : ""}`);
    if (infantsParam > 0)
      parts.push(`${infantsParam} infant${infantsParam > 1 ? "s" : ""}`);
    return parts.join(", ");
  }, [adultsParam, childrenParam, infantsParam]);

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!checkinParam || !checkoutParam) return 1;
    const checkin = new Date(checkinParam);
    const checkout = new Date(checkoutParam);
    const nights = Math.max(
      (checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24),
      1,
    );
    return nights;
  }, [checkinParam, checkoutParam]);

  const [continueBooking] = useContinueBookingMutation();

  // Calculate total price based on nights and number of rooms
  const totalPrice = useMemo(() => {
    return price * numberOfNights * (selectedRoomLength || 1);
  }, [price, numberOfNights, selectedRoomLength]);

  const handleOptionChange = (newValue: number) => {
    setSelectedRoomLength(newValue);
  };

  const handleBook = () => {
    dispatch(
      setNumberOfRooms({
        roomId: id,
        room: selectedRoomLength,
      }),
    );
    bookRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const { id: propertyId } = useParams();

  const handleMobileBook = () => {
    const startTimeKey = "circularTimerStartTime";
    const now = Date.now();
    localStorage.setItem(startTimeKey, now.toString());

    const isLoggedIn = localStorage.getItem("token");

    if (isLoggedIn) {
      continueBooking({
        checkin_date: checkinParam,
        checkout_date: checkoutParam,
        property: Number(propertyId),
        room_details: [
          {
            room: id,
            room_count: selectedRoomLength || 1,
          },
        ],
        adults: adultsParam || 0,
        children: childrenParam || 0,
        infants: infantsParam || 0,
      }).unwrap();
      navigate(`/hotel-view/checkout/${id}/set-details`);
    } else {
      dispatch(
        setPendingBooking({
          checkin_date: checkinParam,
          checkout_date: checkoutParam,
          property: Number(propertyId),
          room_details: [
            {
              room: id,
              room_count: selectedRoomLength || 1,
            },
          ],
          adults: adultsParam || 0,
          children: childrenParam || 0,
          infants: infantsParam || 0,
        }),
      );
      navigate(`/hotel-view/checkout/${id}/login`);
    }
  };

  return (
    <div className="border rounded-2xl sm:p-6 p-4 flex   flex-col gap-4 border-grey-500">
      <div className="flex flex-col-reverse sm:flex-row justify-between flex-wrap sm:gap-0 gap-2 sm:flex ">
        {/* Room Info */}
        <div>
          <h1 className="font-medium text-[1.37rem] leading-[1.815625rem] text-gray">
            {roomName}
          </h1>
          <div className="flex flex-col justify-between gap-4">
            {/* Amenities */}
            <div className="amenities-list flex-col">
              {services?.map((service, index) => {
                // Show guest info if service is "people" and we have guest params
                // Show normal service items
                return (
                  <div key={index} className="service flex items-center">
                    <Icon className="text-gray" name={service.icon} />
                    <span className="text-gray-dark">{service.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Room Services */}
            <div className="flex gap-2 items-center">
              <div className="service-list flex flex-wrap grid-rows-1 gap-2 ghandleBookap-1 items-center">
                {amenities?.slice(0, 6).map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <ServiceContainer service={amenity} />
                  </div>
                ))}
              </div>
              <span>
                {/* Show "+ more" only if there are more than 6 services */}
                {amenities?.length > 6 ? `${amenities.length - 6}+ more` : null}
              </span>
            </div>
          </div>
        </div>

        {/* Room Image */}
        <div className="w-full sm:w-[16.685rem] h-[10.904rem] border-t-[0.0625rem] border-opacity-0 rounded-md overflow-hidden">
          <img
            src={imageUrl || "https://via.placeholder.com/1920x1080"}
            className="w-full h-full object-cover"
            alt="Room"
          />
        </div>
      </div>

      <hr />

      {/* Pricing and Actions */}
      <div className="pricing flex justify-between flex-wrap gap-2">
        <div className="flex flex-col ">
          {/* Guest Info - Only on mobile and tablet */}
          <></>
          <div className="flex  gap-2">
            <span className="text-sm text-gray-600 lg:hidden mb-1">
              {numberOfNights > 1 ? `${numberOfNights} nights` : "1 night"}{" "}
              &bull;
            </span>
            {(adultsParam > 0 || childrenParam > 0 || infantsParam > 0) && (
              <div className="lg:hidden mb-2 text-sm text-gray-600">
                <span className="font-medium">Guests: {totalGuests}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[1.37rem] font-bold text-primary-dark">
              Rs. {totalPrice.toFixed(0)}
            </span>
            {discountedPrice && (
              <span className="text-grey-600 !text-lg font-medium line-through">
                Rs. {discountedPrice}
              </span>
            )}
          </div>
        </div>
        <div className="">
          <div className="flex h-full">
            {/* Left Div */}
            <div className="border pt-1 px-2 h-[3rem] rounded-l-lg border-primary overflow-hidden">
              <OptionSelector
                roomLength={roomLength}
                onChange={handleOptionChange}
              />
            </div>
            <div className="flex w-full h-[3rem] justify-between">
              {/* Right Div */}
              <div className="border-t border-r hover:bg-sky-100 border-b rounded-r-lg h-full border-primary overflow-hidden">
                <Button
                  className="bg-transparent text-primary h-[3rem]"
                  onClick={handleBook}
                >
                  Add to Book
                </Button>
              </div>
              <div className=" h-full border-primary  overflow-hidden lg:hidden">
                <Button className="h-[3rem] w-full" onClick={handleMobileBook}>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomsCard;
