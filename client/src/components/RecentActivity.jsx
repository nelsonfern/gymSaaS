import { User } from "lucide-react";
import { motion } from "framer-motion";

export function RecentActivity({ data }) {
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className=" rounded-xl  p-4">
      <h2 className="text-xl font-bold text-gray-700">Actividad del dia</h2>
      <div className="overflow-y-auto max-h-[300px] bg-gray-50 pb-2 rounded-lg">
        <table className="w-full shadow-xs shadow-gray-200/50">
          <thead className="border-b border-gray-200 sticky top-0 bg-white z-10">
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-4 text-md font-medium text-gray-800">
                Cliente
              </th>
              <th className="text-left py-2 px-4 text-md font-medium text-gray-800">
                Plan
              </th>
              <th className="text-left py-2 px-4 text-md font-medium text-gray-800">
                Fecha
              </th>
              <th className="text-left py-2 px-4 text-md font-medium text-gray-800">
                Estado
              </th>
              <th className="text-left py-2 px-4 text-md font-medium text-gray-800">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="border-b border-gray-200">
            {data.map((activity, index) => (
              <tr
                key={activity._id}
                className={`border-b border-gray-200 ${
                  index === 0 ? "bg-green-50 animate-pulse" : ""
                }`}
              >
                <td className="py-2 px-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User
                      size={25}
                      className="text-blue-500 bg-blue-100 p-1 rounded-full"
                    />
                    {activity.client?.name + " " + activity.client?.lastName}
                  </div>
                </td>
                <td className="py-2 px-2 text-sm text-gray-500">
                  {activity.plan?.name || (
                    <span className="text-gray-400 italic">Sin membresía</span>
                  )}
                </td>
                <td className="py-2 px-4 text-sm text-gray-500">
                  {activity.date
                    ? new Date(activity.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </td>
                <td className="py-2 px-4 text-sm text-gray-500">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${capitalize(activity.status) === "Permitido" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {capitalize(activity.status)}
                  </span>
                </td>
                <td className="py-2 px-4 text-sm text-gray-500">
                  <span>{activity?.deniedReason}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
