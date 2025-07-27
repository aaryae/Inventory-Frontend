import { Link } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  const mainItems = [
    { label: "Home", to: "/" },
    { label: "Contact Us", to: "/contactus" },
  ];

  const blogCategories = ["Food", "Technology", "Business", "Politics"];

  return (
    <div
      id="mobile-menu"
      className={`fixed top-0 right-0 h-full w-2/3 max-w-xs bg-[#000000] text-white transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 p-5 md:hidden shadow-lg`}
    >
      <button
        className="text-3xl absolute right-4 top-4"
        onClick={() => setIsOpen(false)}
      >
        &times;
      </button>

      <ul className="flex flex-col gap-6 mt-16">
        {/* Main Links */}
        {mainItems.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium"
            >
              {label}
            </Link>
          </li>
        ))}

        {/* Blog Categories */}
        <li>
          <span className="text-lg font-semibold">Blog</span>
          <ul className="pl-4 mt-2 space-y-2">
            {blogCategories.map((category) => (
              <li key={category}>
                <Link
                  to={`/${category.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-300 hover:text-white"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
