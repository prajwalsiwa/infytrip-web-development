import { Outlet } from "react-router-dom";
import Header from "../header";

function CheckoutWrapper() {
  return (
    <main className="w-screen h-screen flex flex-col gap-12 overflow-auto">
      <Header />
      <div className="flex-grow container mt-[5rem] sm:mt-0">
        <Outlet />
      </div>
    </main>
  );
}

export default CheckoutWrapper;
