import { X } from "lucide-react";

export function StaffModal({
  show,
  onClose,
  isEditing,
  staffData,
  setStaffData,
  onSubmit
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {isEditing ? "Editar Empleado" : "Añadir Nuevo Empleado"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={staffData.name}
              onChange={(e) =>
                setStaffData({ ...staffData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
              placeholder="Ej. Martín Entrenador"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email de Acceso
            </label>
            <input
              type="email"
              required
              value={staffData.email}
              onChange={(e) =>
                setStaffData({ ...staffData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
              placeholder="martin@gym.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Contraseña Provisoria
            </label>
            <input
              type="text"
              required={!isEditing}
              minLength={6}
              value={staffData.password}
              onChange={(e) =>
                setStaffData({ ...staffData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
              placeholder={isEditing ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 mt-4 transition-colors"
          >
            {isEditing ? "Guardar Cambios" : "Crear Cuenta de Empleado"}
          </button>
        </form>
      </div>
    </div>
  );
}
