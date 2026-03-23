
export function PopUpDelete({id, handleCancel, handleDeleteTrue}){
  return(
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs
 w-full h-full ">
      <div className="bg-white rounded-2xl shadow-sm shadow-gray-200/50 p-6 mt-6">
        <h1>¿Estas seguro de eliminar este cliente?</h1>
        <div className="flex gap-3 mt-6">
          <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer">Cancelar</button>
          <button onClick={() => handleDeleteTrue(id)} className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer">Eliminar</button>
        </div>
      </div>
    </div>
    
  )
}