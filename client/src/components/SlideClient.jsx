import { useClientStore } from "../store/useClientStore";
import { useState } from "react";
import api from "../api/axios";
import { useEffect } from "react";
import { toast } from "sonner";
export function AddClientSlideOver() {
  const isSlideOverOpen = useClientStore((state) => state.isSlideOpen);
  const closeSlide = useClientStore((state) => state.closeSlide);
  const createClient = useClientStore((state) => state.createClient);

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (isSlideOverOpen && plans.length === 0) {
      api
        .get("/plans")
        .then((res) => setPlans(res.data))
        .catch(console.error);
    }
  }, [isSlideOverOpen, plans.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Extraemos todos los datos del formulario automáticamente
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validación de Formato de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Error: Ingresa un correo electrónico válido");
      return;
    }

    // Validación de Teléfono (Eliminamos espacios/guiones y pedimos mínimo 10 números)
    const cleanPhone = data.phone.replace(/\D/g, "");
    if (cleanPhone.length <= 7 || cleanPhone.length > 15) {
      toast.error(
        "Error: El teléfono debe tener entre 7 y 15 dígitos numéricos",
      );
      return;
    }

    // Validación de Plan
    if (!data.plan) {
      toast.error("Error: Debes seleccionar un plan de membresía");
      return;
    }

    // Delegamos todo el manejo de red, base de datos y notificaciones al Store (Zustand)
    await createClient(data, () => {
      e.target.reset(); // Limpia los campos
      closeSlide(); // Cierra el panel
    });
  };

  if (!isSlideOverOpen) return null;

  return (
    <>
      {/* Fondo oscuro que al clickear ejecute closeSlide() */}
      <div className="fixed inset-0 z-50">
        <div
          className="bg-black/20 backdrop-blur-xs
 w-full h-full"
          onClick={closeSlide}
        ></div>
        {/* Panel lateral blanco con un formulario*/}
        <div className="fixed inset-y-0 right-0 z-50">
          <div
            className=" w-110 h-full shadow-xs shadow-gray-200/50 "
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900">
                  Agregar Nuevo Cliente
                </h2>
                <p className="text-gray-300 text-xs font-semibold">
                  PROCESO DE INCORPORACIÓN
                </p>
              </div>
              <button
                onClick={closeSlide}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="h-px bg-gray-200  mx-4"></div>
            <div className="">
              <form className="space-y-4 mt-3" onSubmit={handleSubmit}>
                <div className="p-4 pb-2">
                  <h5 className="text-sm font-bold text-indigo-500">
                    INFORMACIÓN PERSONAL
                  </h5>
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-xs font-medium text-gray-500"
                      >
                        NOMBRE
                      </label>
                      <div className="mt-2">
                        <input
                          required
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="given-name"
                          className="p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="lastName"
                        className="block text-xs font-medium text-gray-500"
                      >
                        APELLIDO
                      </label>
                      <div className="mt-2">
                        <input
                          required
                          type="text"
                          name="lastName"
                          id="lastName"
                          autoComplete="family-name"
                          className="p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-gray-500"
                      >
                        EMAIL
                      </label>
                      <div className="mt-2">
                        <input
                          required
                          placeholder="example@example.com"
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className=" p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone"
                        className="block text-xs font-medium text-gray-500"
                      >
                        TELEFONO
                      </label>
                      <div className="mt-2">
                        <input
                          required
                          placeholder="3804555555"
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="phone"
                          className="p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="dni"
                        className="block text-xs font-medium text-gray-500"
                      >
                        DNI
                      </label>
                      <div className="mt-2">
                        <input
                          required
                          placeholder="22222222"
                          id="dni"
                          name="dni"
                          type="text"
                          autoComplete="dni"
                          className="p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <h5 className="text-sm font-bold text-indigo-500">
                    MEMBRESÍA
                  </h5>

                  <div className="mt-4">
                    <label
                      htmlFor="status"
                      className="mb-2 block text-xs font-medium text-gray-500"
                    >
                      ESTADO
                    </label>
                    <div className="flex gap-2">
                      <button
                        disabled
                        className="p-1.5 block w-full rounded-md py-1.5 text-gray-500 font-semibold border-2 border-gray-500"
                      >
                        Activo
                      </button>

                      <button
                        disabled
                        className="p-1.5 block w-full rounded-md py-1.5 text-indigo-500 font-semibold border-2 border-indigo-500"
                      >
                        Inactivo
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      El estado se actualiza automáticamente al realizar el pago
                      y según la fecha de vencimiento de la membresía.
                    </p>
                  </div>
                </div>

                <div className="mt-auto bg-white border-t-gray-200 border-t fixed bottom-0 right-0 w-110 h-15 p-2 aling-center justify-center flex gap-4 ">
                  <button
                    type="button"
                    onClick={closeSlide}
                    className="rounded-md w-40 h-10 text-md font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-md w-40 h-10 border border-transparent shadow-sm text-md font-medium text-white bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
