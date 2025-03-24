import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { filterTasks, sortTasks } from "../../redux/taskSlice";
import { Filter, SortAsc, Calendar, PlusCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { filters } from "./consts/filter.options";
import { sorts } from "./consts/sort.options";

export function KanbanButtons({ showForm, setShowFormTrue }) {
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState(null);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleFilterChange = (filter) => {
    const updatedFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter((f) => f !== filter)
      : [...selectedFilters, filter];

    setSelectedFilters(updatedFilters);
    dispatch(filterTasks(updatedFilters.length ? updatedFilters.join(",") : "all"));
  };


  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    dispatch(sortTasks(sort, "asc")); 
  };

  

  return (
    <div className="flex justify-between items-center p-4 relative">
      {/* Add Task Button */}
      <button
        className={`flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-700 transition ${
          showForm && "opacity-0"
        }`}
        onClick={setShowFormTrue}
      >
        <PlusCircle className="w-5 h-5" />
        <span className="hidden md:inline ml-1">Add task</span>
      </button>

      {/* Filter & Sort Buttons */}
      <div className="flex items-center space-x-4 text-gray-300">
        {/* Filter Button */}
        <div className="relative" ref={filterRef}>
          <button
            className={`flex items-center px-3 py-1.5 rounded-md cursor-pointer transition ${
              showFilter ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden md:inline ml-1">Filter</span>
          </button>

          {/* Filter Dropdown */}
          {showFilter && (
            <motion.div className="z-10000 absolute overflow-hidden right-0 top-12 bg-gray-900 rounded-lg shadow-lg p-3 w-48 text-white">
              {filters.map((item) => (
                <div
                  key={item.value}
                  className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(item.value)}
                    onChange={() => handleFilterChange(item.value)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sort Button */}
        <div className="relative" ref={sortRef}>
          <button
            className={`flex items-center px-3 py-1.5 rounded-md cursor-pointer transition ${
              showSort ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setShowSort(!showSort)}
          >
            <SortAsc className="w-5 h-5" />
            <span className="hidden md:inline ml-1">Sort</span>
          </button>

          {/* Sort Dropdown */}
          {showSort && (
            <motion.div className="z-10000 absolute overflow-hidden right-0 top-12 bg-gray-900 rounded-lg shadow-lg p-3 w-48 text-white">
              {sorts.map((item) => (
                <div
                  key={item.value}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                    selectedSort === item.value ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleSortChange(item.value)}
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KanbanButtons;
