import { Pencil, Trash, CalendarClock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PopUpDelete } from "./PopUpDelete";
import { useAuth } from "../context/AuthContext";
import { usePlansStore } from "../store/usePlansStore";
export function PlanCards({
  isSelected,
  onClick,
  plan,
  name,
  description,
  duration,
  price,
  type,
}) {
  const { user } = useAuth();
  const deletePlan = usePlansStore((state) => state.deletePlan);
  const openSlide = usePlansStore((state) => state.openSlide);
  const [popUpDelete, setPopUpDelete] = useState({
    show: false,
    id: null,
  });

  const handleDelete = (id) => {
    setPopUpDelete({
      show: true,
      id: id,
    });
  };
  const handleDeleteTrue = (id) => {
    setPopUpDelete({
      show: false,
      id: null,
    });
    deletePlan(id);
  };

  const handleCancel = () => {
    setPopUpDelete({
      show: false,
      id: null,
    });
  };

  return (
    <>
      <motion.div
        onClick={user.role === "admin" ? onClick : null}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          scale: isSelected ? 1.05 : 1,
          boxShadow: isSelected
            ? "0px 2px 5px rgba(0,0,0,0.05)"
            : "0px 2px 5px rgba(0,0,0,0.05)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`
    rounded-xl p-4 w-full min-h-75 flex flex-col cursor-pointer transition-all duration-300
    ${
      isSelected
        ? "bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-lg scale-105"
        : "bg-white text-gray-700 shadow-xs shadow-gray-200/50 border-b border-gray-200 hover:shadow-md"
    }
  `}
      >
        <div className="flex justify-between mb-1">
          <CalendarClock
            size={44}
            className="text-blue-500 bg-blue-100 p-1 rounded-lg"
          />
          {user.role === "admin" && isSelected && (
            <div className=" flex justify-end gap-2">
              <Pencil
                onClick={(e) => {
                  e.stopPropagation();
                  openSlide(plan);
                }}
                size={20}
                className="cursor-pointer hover:text-gray-600"
              />
              <Trash
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(plan._id);
                }}
                size={20}
                className="cursor-pointer hover:text-gray-600"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h2
            className={`text-4xl font-bold ${isSelected ? "text-white" : "text-gray-700"}`}
          >
            {name}
          </h2>
          <span
            className={`${isSelected ? "text-white/80" : "text-gray-500"} text-xs`}
          >
            {description}
          </span>
        </div>

        <div className="mt-auto justify-end">
          <span
            className={`${isSelected ? "text-white/80" : "text-gray-500"} text-xs font-light mb-2`}
          >
            Duración dias: {duration}
          </span>
          <h1
            className={`text-3xl font-bold ${isSelected ? "text-white" : "text-gray-700"}`}
          >
            ${price}
            <span className="text-sm font-light">/{type}</span>
          </h1>
          <span
            className={`${isSelected ? "text-white/80" : "text-gray-500"} text-xs font-light`}
          >
            Precio del plan
          </span>
        </div>
      </motion.div>
      {popUpDelete.show && (
        <PopUpDelete
          id={popUpDelete.id}
          handleCancel={handleCancel}
          handleDeleteTrue={handleDeleteTrue}
        />
      )}
    </>
  );
}
