import { Download, Trash, Pencil, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { PopUpDelete } from "./PopUpDelete";
import * as XLSX from "xlsx";

export function DataTable({
  data = [],
  columns = [],
  page = 1,
  totalPages = 1,
  title = "",
  onEdit,
  onDelete,
  fetchAllData, // async () => rows[]  — si se provee, exporta TODOS los registros
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasActions = onEdit || onDelete;
  const [popUp, setPopUp] = useState({
    show: false,
    id: null,
  });

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  const handleDelete = (id) => {
    setPopUp({ show: true, id });
  };

  const handleDeleteTrue = () => {
    onDelete && onDelete(popUp.id);
    setPopUp({ show: false, id: null });
  };

  const handleCancel = () => {
    setPopUp({ show: false, id: null });
  };

  // Build CSV-compatible headers/rows. Columns can use `key` (simple field) or `csvValue` (function)
  const csvColumns = columns.filter((col) => col.key || col.csvValue);
  const csvHeaders = csvColumns.map((col, i) => ({
    label: col.header,
    key: col.key || `_col${i}`,
  }));
  const csvData = data.map((item) =>
    Object.fromEntries(
      csvColumns.map((col, i) => [
        col.key || `_col${i}`,
        col.csvValue ? col.csvValue(item) : (item[col.key] ?? ""),
      ]),
    ),
  );
  const excelData = csvData.map((row) =>
    Object.fromEntries(csvHeaders.map((h) => [h.label, row[h.key]])),
  );

  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      // Si se provee fetchAllData, traer todos los registros sin paginación
      let allRows = data;
      if (fetchAllData) {
        allRows = await fetchAllData();
      }

      // Construir el excel con TODOS los datos
      const allCsvData = allRows.map((item) =>
        Object.fromEntries(
          csvColumns.map((col, i) => [
            col.key || `_col${i}`,
            col.csvValue ? col.csvValue(item) : (item[col.key] ?? ""),
          ]),
        ),
      );
      const allExcelData = allCsvData.map((row) =>
        Object.fromEntries(csvHeaders.map((h) => [h.label, row[h.key]])),
      );

      const worksheet = XLSX.utils.json_to_sheet(allExcelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title || "Export");
      XLSX.writeFile(
        workbook,
        `${title || "export"}-${new Date().toLocaleString("es-ES")}.xlsx`,
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs p-6 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="flex gap-3 text-green-500">
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="flex items-center gap-2 hover:text-green-700 cursor-pointer disabled:opacity-50"
          >
            <span className="text-xs font-semibold">
              {exporting ? "Exportando..." : "Exportar a excel"}
            </span>
            {exporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full  border-gray-200">
        <thead>
          <tr className="text-gray-800 text-xs border-b border-gray-200 font-light">
            {columns.map((col, i) => (
              <th key={i} className="text-left p-3 ">
                {col.header}
              </th>
            ))}
            {hasActions && <th className="font-inter text-right ">ACCIONES</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="">
              {columns.map((col, j) => (
                <td key={j} className="py-4">
                  {col.render(item)}
                </td>
              ))}

              {/* ACTIONS */}
              {hasActions && (
                <td className="text-right">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-500 hover:bg-indigo-400 hover:text-white rounded-full p-1"
                    >
                      <Pencil size={18} />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:bg-red-400 hover:text-white rounded-full p-1"
                    >
                      <Trash size={18} />
                    </button>
                  )}

                  {popUp.show && (
                    <PopUpDelete
                      id={popUp.id}
                      handleCancel={handleCancel}
                      handleDeleteTrue={handleDeleteTrue}
                    />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No hay datos disponibles
        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <p>
          Pagina {page} de {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded-lg ${
              page === 1
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            onClick={() => page > 1 && handlePageChange(page - 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-lg ${
                page === i + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className={`px-3 py-1 rounded-lg ${
              page >= totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            onClick={() => page < totalPages && handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
