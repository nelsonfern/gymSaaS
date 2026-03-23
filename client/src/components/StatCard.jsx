export function StatCard ({title, value, icon, color, subtitle, textColor, titleColor, bgColor}) {
    return (
        <div className={`${bgColor || "bg-white"} rounded-xl shadow-xs shadow-gray-200/50 border-b border-gray-200 p-4`}>
            <div className="flex items-center justify-between w-full">
                <div className="w-full">
                    <h3 className={` text-sm font-medium ${titleColor || "text-gray-800"}`}>{title}</h3>
                    <p className={` pt-2 text-2xl font-bold ${textColor || "text-gray-800"}`}>{value}</p>
                </div>
                {icon && (
                    <div className={`ml-2 p-2 rounded-lg ${color}`}>
                        {icon}
                    </div>
                )}
            </div>
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        </div>
    )
}