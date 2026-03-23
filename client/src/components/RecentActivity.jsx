export function RecentActivity ({data}) {
    return (
        <div className=" rounded-xl  p-4">
            <h2 className="text-xl font-bold text-gray-700">Actividad del dia</h2>
            <div className="overflow-y-auto max-h-[300px] bg-gray-50 pb-2 rounded-lg">
                <table className="w-full shadow-xs shadow-gray-200/50">
                    <thead className="border-b border-gray-200 sticky top-0 bg-white z-10">
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Cliente</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Estado</th>
                    </tr>
                </thead>
                <tbody className="border-b border-gray-200">
                    {data.map((activity, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-2 px-4 text-sm text-gray-500">{activity.client.name}</td>
                            <td className="py-2 px-4 text-sm text-gray-500">{activity.date ? new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>
                            <td className="py-2 px-4 text-sm text-gray-500"><span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.client?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {activity.client?.status === "active" ? "Activo" : "Inactivo"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )
}