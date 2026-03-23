import { useEffect } from "react";
import { usePlansStore } from "../store/usePlansStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
export function EditPlans() {
    const {register, setValue} = useForm();
    const { isSlideOpen, slideMode, plan, closeSlide, updatePlan, addPlan } = usePlansStore();
   
    useEffect(() => {
        if (slideMode === 'edit' && plan) {
            setValue("name", plan.name)
            setValue("description", plan.description)
            setValue("durationDays", plan.durationDays)
            setValue("price", plan.price)
        } else {
            setValue("name", "")
            setValue("description", "")
            setValue("duration", "")
            setValue("price", "")
        }
    }, [plan, slideMode, setValue]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        if(!data.name || !data.description || !data.durationDays || !data.price){
            toast.error("Todos los campos son obligatorios")
            return
        }
        if(data.price <= 0){
            toast.error("El precio debe ser mayor a 0")
            return
        }
        if(data.durationDays <= 0){
            toast.error("La duración debe ser mayor a 0")
            return
        }
        
        const payload = {
            name: data.name,
            description: data.description,
            durationDays: Number(data.durationDays),
            price: Number(data.price)
        }

        if (slideMode === "edit") {
            if(data.name === plan.name && data.description === plan.description && Number(data.durationDays) === plan.durationDays && Number(data.price) === plan.price){
                toast.error("No se han realizado cambios")
                return
            }
            await updatePlan(plan._id, payload)
        } else {
            await addPlan(payload)
        }
        
        e.target.reset()
        closeSlide()
    };

    if (!isSlideOpen) return null;

    return (
        <>
        {/* fondo oscuro */}
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-black/20 backdrop-blur-xs
 w-full h-full" onClick={closeSlide}>
                
            </div>
            {/* panel blanco */}
            <div className="fixed inset-y-0 right-0 z-50 ">
                <div className="w-110 h-full shadow-xs shadow-gray-200/50 bg-white flex flex-col">
                <div className="flex flex-col p-6 border-b border-gray-200">
                    <h2 className="text-3xl font-bold ">{slideMode === 'edit' ? 'Editar Plan' : 'Agregar Plan'}</h2>
                   <p className="text-xs text-gray-400 font-semibold">
                    Ingrese los datos del plan
                   </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 px-4 mt-6 overflow-y-auto">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="name">NOMBRE</label>
                        <input
                            type="text"
                            name="name"
                            {...register("name")}
                            className="text-gray-500 w-full px-3 py-2 border rounded-lg border-gray-200 focus:border-indigo-600 "
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="description">DESCRIPCIÓN</label>
                        <textarea
                            name="description"
                            {...register("description")}
                            placeholder="Descripción del plan"
                            className="w-full h-20 px-3 py-2 border rounded-lg border-gray-200 resize-none"
                            required
                            
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="duration">DURACIÓN</label>
                        <input
                            type="text"
                            name="durationDays"
                            {...register("durationDays")}
                            className="w-full px-3 py-2 border rounded-lg border-gray-200"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-2" htmlFor="price">PRECIO</label>
                        <input
                            type="number"
                            name="price"
                            {...register("price")}
                            className="w-full px-3 py-2 border rounded-lg border-gray-200"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-row items-center justify-between gap-2 mt-auto pb-6 pt-4">
                        <button
                            type="button"   
                            onClick={closeSlide}
                            className="px-4 py-2 border rounded-lg w-full"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
                </div>
            </div>
            
        </div>
        </>
    );
}