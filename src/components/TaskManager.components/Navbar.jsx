import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Power, Search, X } from "lucide-react";
import { searchTasks } from "../../redux/taskSlice";
import { formatDate } from "../../utils/formatDate";
import { logout } from "../../redux/authSlice";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchBoxRef = useRef(null);
  const debounceTimeout = useRef(null);

  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.tasks.searchResults || []); // Fallback to empty array

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.trim().length > 0);
  };

  // Debounced API Call
  useEffect(() => {
    if (!searchQuery.trim()) return;

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      dispatch(searchTasks(searchQuery));
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery, dispatch]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const powerButtonClick = () => {
    dispatch(logout())
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 w-full">
      <div className="text-white text-lg font-semibold">T/M</div>

      {/* Search Bar */}
      <div
        ref={searchBoxRef}
        className="relative flex items-center bg-gray-800 rounded-full px-2 md:px-4 py-2 w-40 md:flex-grow max-w-2xl"
      >
        <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2" />

        <input
          className="text-white text-xs md:text-lg outline-none bg-transparent w-full"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowDropdown(searchQuery.trim().length > 0)}
        />

        {searchQuery && (
          <button onClick={() => setSearchQuery("")}>
            <X className="w-5 h-5 text-gray-400 ml-2 hover:text-gray-300" />
          </button>
        )}

        {/* Search Suggestions (Dropdown) */}
        {showDropdown && (
          <div className="absolute top-12 left-0 w-full bg-gray-800 rounded-lg shadow-lg p-3 z-100">
            <p className="text-gray-300 text-sm">Search Results</p>
            <div className="mt-2">
              {searchResults.length > 0 ? (
                searchResults.map((task) => (
                  <div
                    key={task.id}
                    className="text-white mt-5 flex gap-2 md:gap-5"
                  >
                    <p className="text-normal md:text-xl mb-2">🔍</p>
                    <div className="flex flex-col text-neutral-300">
                      <p className="text-normal md:text-xl text-white mb-2">
                        {task.name}
                      </p>

                      <small className="hidden md:inline">
                        {task.description}
                      </small>
                      <small>{task.status}</small>
                      <small>{formatDate(task.due_date)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs">No results found</p>
              )}
            </div>
          </div>
        )}
      </div>

      <button onClick={() => powerButtonClick()} className="p-2 md:px-4 md:py-2 rounded-full border border-gray-500 text-gray-300 hover:bg-gray-700 transition flex items-center">
        <Power className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden ml-2 md:inline text-sm">Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
