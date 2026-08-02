import { useState } from "react";
import {
  House,
  Menu,
  Video,
  Users,
  User,
  UserCircle,
  LogOutIcon,
  Book,
} from "lucide-react";
import { Link } from "react-router-dom";
function StudentNavBar() {
  const menuItems = [
    { icons: <House size={20} />, labels: "Application", path: "/form" },
    { icons: <Video size={20} />, labels: "Classes" },
    { icons: <User size={20} />, labels: "Moderator" },
    { icons: <Book size={20} />, labels: "Library" },
    { icons: <UserCircle size={20} />, labels: "Profile" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className={`h-screen flex flex-col p-2 bg-blue-500 shadow-md transition-all duration-300 ease-in-out ${
        isOpen ? "w-40" : "w-16"
      }`}
    >
      {/* Header */}
      {/* <div className="">

      </div> */}
      <div
        className={`border flex justify-between items-center gap-1 px-3 py-2 border-blue-400 border-2 ${
          isOpen ? "rounded" : "rounded-full"
        } shadow-md`} onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="/logo.png"
          className={`transition-all duration-300 ease-in-out ${
            isOpen
              ? "w-6 h-6 opacity-100 scale-100"
              : "w-0 h-0 opacity-0 scale-0"
          } rounded-full`}
        />

        {/* <h1>O.C.O.Y.A.M</h1> */}
        <Menu size={20} />
      </div>

      {/* Body */}

      <ul className="flex-1">
        {menuItems.map((items, index) => {
          return (
            <Link to={items.path || `/${items.labels.toLocaleLowerCase()}`}>
            <li
              key={index}
              className="py-2 px-3 my-3 hover:bg-blue-600 rounded-md duration-300 curser-pointer flex gap-2 items-center"
            >
             <div>{items.icons}</div>
              <p
                className={`transition-all cursor-pointer duration-300 origin-left ${
                  isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
                } whitespace-nowrap`}
              >
                {items.labels}
              </p>
            </li>
                </Link>
          );
        })}
      </ul>
      {/* Footer */}
       <Link to = "/logout">
      <div className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-blue-600 rounded-md duration-300 cursor-pointer">
       <div> <LogOutIcon size={25} /> </div>
        <span className={`transition-all duration-300 origin-left ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"} whitespace-nowrap`}>
  Logout 
</span>
      </div>
        </Link>
    </nav>
  );
}
export default StudentNavBar;