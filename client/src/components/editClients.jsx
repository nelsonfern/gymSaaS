import { useClientStore } from "../store/useClientStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";

export function EditClientSlideOver() {
  const { register, setValue, handleSubmit: handleFormSubmit } = useForm();
  const isSlideOverOpen = useClientStore((state) => state.isSlideOpen);
  const closeSlide = useClientStore((state) => state.closeSlide);
  const updateClient = useClientStore((state) => state.updateClient);
  const client = useClientStore((state) => state.client);
  const getClientById = useClientStore((state) => state.getClientById);

  useEffect(() => {
    async function loadClient() {
      if (client._id) {
        const res = await getClientById(client._id);
        setValue("name", res.name);
        setValue("lastName", res.lastName);
        setValue("email", res.email);
        setValue("dni", res.dni);
        setValue("phone", res.phone);
        setValue("allowEmail", res.allowEmail || false);
      }
    }
    loadClient();
  }, [client]);

  const handleSubmit = async (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Error: Ingresa un correo electrónico válido");
      return;
    }

    const cleanPhone = data.phone.replace(/\D/g, "");
    if (cleanPhone.length <= 7 || cleanPhone.length > 15) {
      toast.error(
        "Error: El teléfono debe tener entre 7 y 15 dígitos numéricos",
      );
      return;
    }

    if (
      data.name.trim() === client.name &&
      data.lastName.trim() === client.lastName &&
      data.email.trim() === client.email &&
      data.dni.trim() === client.dni &&
      data.phone.trim() === client.phone &&
      data.allowEmail === client.allowEmail
    ) {
      toast.warning("No se han realizado cambios");
      return;
    }

    await updateClient(client._id, data, () => {
      closeSlide();
    });
  };

  if (!isSlideOverOpen) return null;

  return (
    <>
      {/* Fondo oscuro que al clickear ejecute closeSlide() */}
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          onClick={closeSlide}
        ></div>
        {/* Panel lateral blanco con un formulario*/}
        <div className="fixed inset-y-0 right-0 z-50 ">
          <div className=" w-110 h-full shadow-xs shadow-gray-200/50 bg-white">
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900">
                  Editar Cliente
                </h2>
              </div>
              <button
                type="button"
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
            <div className="flex justify-center items-center flex-col mb-4">
              <User className="w-20 h-20 text-gray-400 bg-gray-200 rounded-full p-2 mb-2" />
              <h1 className="text-gray-600 text-2xl font-semibold">
                {client.name + " " + client.lastName}
              </h1>
              <p className="text-gray-400 text-sm font-semibold">
                {" "}
                Se unió el{" "}
                {new Date(client.createdAt).toLocaleDateString([], {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="h-px bg-gray-200  mx-4"></div>
            <div className="">
              <form
                className="space-y-4 mt-3"
                onSubmit={handleFormSubmit(handleSubmit)}
              >
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
                          {...register("name")}
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
                          {...register("lastName")}
                          type="text"
                          name="lastName"
                          id="lastName"
                          autoComplete="family-name"
                          className="p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-gray-500"
                      >
                        EMAIL
                      </label>
                      <div className="mt-2">
                        <input
                          required
                          {...register("email")}
                          placeholder="example@example.com"
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className=" p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="phone"
                        className="block text-xs font-medium text-gray-500"
                      >
                        TELEFONO
                      </label>
                      <div className="mt-2">
                        <input
                          required
                          {...register("phone")}
                          placeholder="3804555555"
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="phone"
                          className="p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3   ">
                      <label
                        htmlFor="dni"
                        className="block text-xs font-medium text-gray-500"
                      >
                        DNI
                      </label>
                      <div className="mt-2">
                        <input
                          required
                          {...register("dni")}
                          placeholder="22222222"
                          id="dni"
                          name="dni"
                          type="text"
                          autoComplete="dni"
                          className="p-1.5 bg-white block w-full rounded-md border-0 py-1.5 text-gray-500  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="checkbox"
                          id="allowEmail"
                          {...register("allowEmail")}
                          className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="allowEmail"
                          className="text-sm font-medium text-gray-600"
                        >
                          Permitir envío de correos automáticos
                        </label>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Recibirá notificaciones de pagos, vencimientos y avisos
                        importantes.
                      </p>
                    </div>
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
