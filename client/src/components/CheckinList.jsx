import { User } from "lucide-react";
export function RecentCheckins({ data }) {
  return (
    <div className="bg-gray-200/30 rounded-2xl p-4 ">
      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div
            key={item._id}
            className={`flex items-center gap-3 p-2 rounded-xl bg-white transition ${index === 0 ? "bg-green-50 animate-pulse" : ""}`}
          >
            <div
              className={`rounded-full p-3 ${item.status === "permitido" ? "bg-green-100" : "bg-red-100"}`}
            >
              <User
                size={28}
                className={
                  item.status === "permitido"
                    ? "text-green-600"
                    : "text-red-500"
                }
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {item.client?.name + " " + item.client?.lastName}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(item.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                • {item.plan?.name || "Sin plan"}
              </p>
            </div>

            {/* Estado */}
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                item.status === "permitido"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {item.status === "permitido" ? "Ingreso" : "Denegado"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
