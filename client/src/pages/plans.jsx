import { CirclePlus } from "lucide-react";
import { PlanCards } from "../components/planCards";
import { EditPlans } from "../components/editPlans";
import { usePlansStore } from "../store/usePlansStore";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const fetchPlans = usePlansStore((state) => state.fetchPlans);
  const plans = usePlansStore((state) => state.plans);
  const openSlide = usePlansStore((state) => state.openSlide);
  const { user } = useAuth();
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };
  return (
    <>
      <div className="mb-4 p-2">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Planes</h1>
        <p className="text-gray-500 text-sm font-normal">
          Aquí puedes ver todos los planes registrados en el gimnasio.
        </p>

        <div className="flex justify-end">
          {user.role === "admin" && (
            <button
              onClick={() => openSlide()}
              className="w-48 h-10 flex justify-center items-center align-center
                px-4 py-2 border border-transparent 
                rounded-md shadow-sm text-white 
                bg-indigo-600 hover:bg-indigo-700 
                hover:shadow-lg hover:shadow-indigo-600/50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CirclePlus size={18} className="mr-2" />
              <span className="text-xs font-semibold"> Agregar Plan</span>
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCards
            plan={plan}
            isSelected={selectedPlan === plan._id}
            onClick={() => handleSelectPlan(plan._id)}
            key={plan._id}
            name={plan.name}
            price={plan.price}
            duration={plan.durationDays}
            type={plan.typePlan}
            description={plan.description}
          />
        ))}
      </div>
      <EditPlans />
    </>
  );
}
