export function StatCard({ title, value, icon, color, subtitle, textColor, titleColor, bgColor }) {
  return (
    <div className={`relative overflow-hidden ${bgColor || "bg-white"} rounded-2xl p-5 border border-gray-100/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className={`text-xs uppercase tracking-wide font-semibold ${titleColor || "text-gray-500"}`}>
            {title}
          </h3>
          <p className={`text-2xl font-bold tracking-tight ${textColor || "text-gray-900"}`}>
            {value}
          </p>
        </div>
        
        {icon && (
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${color}`}>
            {icon}
          </div>
        )}
      </div>
      
      {subtitle && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className="text-xs font-medium text-gray-400">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}