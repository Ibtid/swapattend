import { Filter, SortAsc, Calendar, PlusCircle, ThumbsUp, ThumbsDown } from "lucide-react";

export const filters = [
    { label: "All", value: "all", icon: Filter },
    { label: "To Do", value: "To Do", icon: ThumbsDown },
    { label: "In Progress", value: "In Progress", icon: ThumbsUp },
    { label: "Done", value: "Done", icon: Calendar },
  ];
