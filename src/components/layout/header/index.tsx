import { Button } from "@/components/ui/button";
import { usePageScroll } from "@/lib/hooks/usePageScroll";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { Link, useSearchParams } from "react-router-dom";
import AuthDropdown from "./AuthDropdown";
import Icon from "@/components/ui/Icon";
import ausFlag from "@/assets/Images/ausflag.jpeg";
import nepalFlag from "@/assets/Images/nepalflag.png";
import usaFlag from "@/assets/Images/usaflag.jpg";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MobileMenu from "./MobileMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

const Header = () => {
  const [searchParams] = useSearchParams();
  const [activeCountry, setActiveCountry] = useState("Nepal");

  const activeTab = searchParams.get("tab") || "stays";
  const { isScrolled } = usePageScroll(200);
  const user = useAppSelector((state) => state?.user.user);

  const userInitials =
    user &&
    user
      .split(" ")
      .map((item) => item.charAt(0).toUpperCase())
      .join("");

  const handleMenuClick = (id: number) => {
    // Add your logic here based on the clicked menu item
    switch (id) {
      case 1:
        break;
      case 2:
        break;
      default:
    }
  };

  const countries = [
    {
      name: "Nepal",
      code: "npr",
      flag: nepalFlag,
    },
    {
      name: "Australia",
      code: "aud",
      flag: ausFlag,
    },
    {
      name: "USA",
      code: "usd",
      flag: usaFlag,
    },
  ];

  const getCurrencyCode = (country: string) => {
    const countryObj = countries.find(
      (c) => c.name.toLowerCase() === country.toLowerCase()
    );
    return countryObj?.code.toUpperCase() || "NPR";
  };

  const getCountryFlag = (country: string) => {
    const countryObj = countries.find(
      (c) => c.name.toLowerCase() === country.toLowerCase()
    );
    return countryObj?.flag || nepalFlag;
  };

  return (
    <header
      className={cn(
        "header sm:relative absolute sm:border sm:border-b xl:px-12 px-3 sm:px-6 w-full z-50 !bg-grey-100 shadow-md sm:shadow-none sm:!bg-transparent sm:bg-white",
        {
          "header-sticky": isScrolled,
        }
      )}
    >
      <nav className="w-full">
        <div className="py-3 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Navigation Links */}
          <div className="flex items-center sm:gap-6 gap-6 flex-shrink-0">
            {/* Mobile Menu Icon */}
            <Dialog>
              <DialogTrigger>
                <div className="block sm:hidden">
                  <Icon name="menu" className="text-lg" />
                </div>
              </DialogTrigger>
              <DialogContent className="w-screen h-screen">
                <MobileMenu />
              </DialogContent>
            </Dialog>
            {/* Logo */}
            <Link to="/">
              <img
                src="/infytrip_logo.png"
                alt="Infytrip Logo"
                width={120}
                height={40}
                className="w-20 sm:w-[120px] h-auto"
              />
            </Link>
            {/* Links for larger screens */}
            <div className="hidden sm:flex gap-6">
              <Link
                to={`/search/hotel-list?tab=${activeTab}`}
                className="hover:text-gray transition-all text-sm md:text-base"
              >
                Hotels
              </Link>
              {/* COMMENTED OUT FOR PRE-LAUNCH (STAYS ONLY) */}
              {/* <Link
                to={`/search/package-list?tab=${activeTab}`}
                className="hover:text-gray transition-all"
              >
                Packages
              </Link> */}
            </div>
          </div>

          {/* Right Side (User Options) */}
          <div className="flex items-center gap-4 sm:gap-4 md:gap-6 flex-wrap justify-end">
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center sm:border-none gap-1 sm:gap-2 cursor-pointer hover:opacity-70 transition-opacity p-1.5 sm:p-2 rounded-md hover:bg-grey-50 active:bg-grey-100">
                    <div className="w-5 h-5 sm:w-6 sm:h-6  overflow-hidden flex-shrink-0 ">
                      <img
                        src={getCountryFlag(activeCountry)}
                        alt={`${activeCountry} Flag`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-xs sm:text-sm hidden sm:inline">
                      {getCurrencyCode(activeCountry)}
                    </span>
                    <Icon
                      name="keyboard_arrow_down"
                      className="text-gray-500 text-xs sm:text-base block sm:block"
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-40 border bg-white rounded-md mt-2 py-2 mr-4"
                  style={{ zIndex: 9999 }}
                >
                  <div className="flex flex-col gap-1">
                    {countries.map((country) => (
                      <div
                        key={country.code}
                        className={`flex items-center cursor-pointer hover:bg-grey-100 gap-2 p-2 text-xs transition-colors ${
                          activeCountry === country.name ? "bg-grey-200" : ""
                        }`}
                        onClick={() => setActiveCountry(country.name)}
                      >
                        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={country.flag}
                            alt={`${country.name} Flag`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {country.code.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Notification and "List your Property" (Visible on larger screens) */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <Icon
                name="notifications"
                className="cursor-not-allowed text-gray-500 text-sm md:text-base"
              />
              <Link to="/list-your-property">
                <span className="underline font-bold text-xs md:text-sm text-gray-dark">
                  List your Property
                </span>
              </Link>
            </div>
            {/* Auth Section */}
            <div className="flex-shrink-0">
              {localStorage.getItem("token") ? (
                <div className="w-8 sm:w-10 h-8 sm:h-10 border rounded-full flex bg-primary text-white font-semibold justify-center items-center text-xs sm:text-base">
                  <AuthDropdown
                    user={userInitials}
                    onMenuClick={(id) => handleMenuClick(id)}
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="items-center hidden sm:flex justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4"
                  asLink
                  href="/login"
                >
                  <UserRound className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden md:inline">Login/Register</span>
                  <span className="md:hidden">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
