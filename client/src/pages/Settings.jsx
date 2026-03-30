import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSettingsStore } from "../store/useSettingsStore";
import { useStaffStore } from "../store/useStaffStore";
import { useNavigate } from "react-router-dom";
import { Save, Loader2, CheckCircle2, Plus } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { StaffModal } from "../components/StaffModal";
import api from "../api/axios";

export default function Settings() {
  const { user } = useAuth();
  const {
    settings,
    fetchSettings,
    updateSettings,
    loading: storeLoading,
    error: storeError,
  } = useSettingsStore();
  const navigate = useNavigate();

  // Estado local para los inputs del formulario
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  // Variables para Gestión de Staff
  const { staffList, fetchStaff, addStaff, deleteStaff, updateStaff } =
    useStaffStore();
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [isEditingStaff, setIsEditingStaff] = useState(false);
  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [inputs, setInputs] = useState({
    disabled: true,
  });

  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchSettings();
    fetchStaff();
  }, [user, navigate, fetchSettings, fetchStaff]);

  // Cuando lleguen los settings del backend, copiarlos al formulario local
  useEffect(() => {
    if (settings && !formData) {
      setFormData(settings);
    }
  }, [settings, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    try {
      await updateSettings(formData);
      setSuccess("Configuración guardada exitosamente");
      setTimeout(() => setSuccess(null), 3000); // ocultar mensaje después de 3s
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStaff = (item) => {
    setStaffData({
      _id: item._id,
      name: item.name,
      email: item.email,
      password: "",
    });
    setIsEditingStaff(true);
    setShowStaffModal(true);
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    if (isEditingStaff) {
      await updateStaff(staffData._id, staffData);
    } else {
      await addStaff(staffData);
    }
    setShowStaffModal(false);
    setStaffData({ name: "", email: "", password: "" });
    setIsEditingStaff(false);
  };

  if (storeLoading || !formData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-xl">
        Error: {storeError}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ajustes Generales</h1>
        <p className="text-sm text-gray-500 mt-1">
          Personalizá la información básica y apariencia de tu gimnasio.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-100/60 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label
                htmlFor="gymName"
                className="text-sm font-medium text-gray-700"
              >
                Nombre del Gimnasio
              </label>
              <input
                type="text"
                id="gymName"
                name="gymName"
                value={formData.gymName || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                placeholder="Ej. FitLife Gym"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Logo del Gimnasio
              </label>
              <div className="flex items-center gap-4 mt-1">
                {formData.logoUrl && (
                  <img
                    src={
                      formData.logoUrl.startsWith("/uploads")
                        ? `${import.meta.env.VITE_API_URL}${formData.logoUrl}`
                        : formData.logoUrl
                    }
                    alt="Logo"
                    className="w-32 h-32 rounded-lg object-contain bg-gray-50 border border-gray-200"
                  />
                )}
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center w-full transition-colors">
                  <span>
                    {formData.logoUrl ? "Cambiar Imagen" : "Subir Imagen"}
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      // Max 5MB
                      if (file.size > 5 * 1024 * 1024) {
                        alert("El logo no puede pesar más de 5MB.");
                        return;
                      }

                      const data = new FormData();
                      data.append("logo", file);

                      try {
                        // Subimos a memoria del server temporalmente y obtenemos /uploads/...
                        const res = await api.post("/upload", data, {
                          headers: { "Content-Type": "multipart/form-data" },
                        });
                        if (res.data.success) {
                          setFormData((prev) => ({
                            ...prev,
                            logoUrl: res.data.url,
                          }));
                        }
                      } catch (err) {
                        alert(
                          "Error subiendo el archivo. Revisá permisos de admin.",
                        );
                      }
                    }}
                  />
                </label>
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, logoUrl: "" }))
                    }
                    className="text-red-500 text-sm hover:underline font-medium min-w-[50px]"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="currencySymbol"
                className="text-sm font-medium text-gray-700"
              >
                Símbolo de Moneda
              </label>
              <input
                type="text"
                id="currencySymbol"
                name="currencySymbol"
                value={formData.currencySymbol || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="$"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="whatsappNumber"
                className="text-sm font-medium text-gray-700"
              >
                Número de WhatsApp
              </label>
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo Electrónico (Staff)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="info@migym.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Av. Falsa 123"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
            <div>
              {success && (
                <span className="flex items-center text-sm font-medium text-emerald-600">
                  <CheckCircle2 size={16} className="mr-1" /> {success}
                </span>
              )}
            </div>
            {/* boton para habilitar inputs */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: Gestión de Empleados */}
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Cuentas de Personal
            </h2>
            <p className="text-sm text-gray-500">
              Administra los accesos de tus entrenadores y recepcionistas.
            </p>
          </div>
          <button
            onClick={() => {
              setIsEditingStaff(false);
              setStaffData({ name: "", email: "", password: "" });
              setShowStaffModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Añadir Staff
          </button>
        </div>

        <DataTable
          columns={[
            {
              header: "NOMBRE",
              key: "name",
              render: (s) => (
                <span className="font-semibold text-gray-800">{s.name}</span>
              ),
            },
            {
              header: "EMAIL",
              key: "email",
              render: (s) => <span className="text-gray-600">{s.email}</span>,
            },
            {
              header: "ROL",
              key: "role",
              render: () => (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold tracking-wide uppercase">
                  Staff
                </span>
              ),
            },
          ]}
          data={staffList}
          onDelete={(id) => deleteStaff(id)}
          onEdit={(item) => handleEditStaff(item)}
          isLoading={storeLoading}
        />
        {/* Modal Extraído para Staff */}
        <StaffModal
          show={showStaffModal}
          onClose={() => setShowStaffModal(false)}
          isEditing={isEditingStaff}
          staffData={staffData}
          setStaffData={setStaffData}
          onSubmit={handleStaffSubmit}
        />
      </div>
    </div>
  );
}
