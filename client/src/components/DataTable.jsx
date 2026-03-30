import {
  Download,
  Trash,
  Pencil,
  Loader2,
  AlertCircle,
  InboxIcon,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { PopUpDelete } from "./PopUpDelete";
import * as XLSX from "xlsx";
import { useAuth } from "../context/AuthContext";
// ─── Skeleton row ────────────────────────────────────────────────
function SkeletonRow({ cols, hasActions }) {
  return (
    <tr className="animate-pulse border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-3">
          <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
          {i === 0 && (
            <div className="h-2.5 bg-gray-100 rounded-full w-1/2 mt-2" />
          )}
        </td>
      ))}
      {hasActions && (
        <td className="py-4 text-right px-3">
          <div className="inline-flex gap-2 justify-end">
            <div className="h-7 w-7 bg-gray-200 rounded-full" />
            <div className="h-7 w-7 bg-gray-200 rounded-full" />
          </div>
        </td>
      )}
    </tr>
  );
}

export function DataTable({
  data = [],
  columns = [],
  page = 1,
  totalPages = 1,
  title = "",
  onEdit,
  onDelete,
  fetchAllData,
  isLoading = false, // ← nuevo prop
  error = null, // ← nuevo prop
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasActions = onEdit || onDelete;
  const [popUp, setPopUp] = useState({ show: false, id: null });
  const { user } = useAuth();
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  const handleDelete = (id) => setPopUp({ show: true, id });
  const handleDeleteTrue = () => {
    onDelete && onDelete(popUp.id);
    setPopUp({ show: false, id: null });
  };
  const handleCancel = () => setPopUp({ show: false, id: null });

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
      let allRows = data;
      if (fetchAllData) allRows = await fetchAllData();

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
            disabled={exporting || isLoading}
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

      {/* ERROR STATE */}
      {error && !isLoading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-4 mb-4 text-red-600">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* TABLE */}
      <table className="w-full border-gray-200">
        <thead>
          <tr className="text-gray-800 text-xs border-b border-gray-200 font-light">
            {columns.map((col, i) => (
              <th key={i} className="text-left p-3">
                {col.header}
              </th>
            ))}
            {hasActions && <th className="font-inter text-right">ACCIONES</th>}
          </tr>
        </thead>

        <tbody>
          {/* SKELETON mientras carga */}
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow
                  key={i}
                  cols={columns.length}
                  hasActions={hasActions}
                />
              ))
            : data.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((col, j) => (
                    <td key={j} className="py-4 px-1">
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
                      {user.role === "admin" && onDelete && (
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

      {/* EMPTY STATE - solo si no está cargando ni hay error */}
      {!isLoading && !error && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-gray-400 gap-3">
          <InboxIcon size={36} className="text-gray-300" />
          <p className="text-sm font-medium">No hay datos disponibles</p>
        </div>
      )}

      {/* FOOTER paginación */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <p>
          Pagina {page} de {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded-lg ${page === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
            onClick={() => page > 1 && handlePageChange(page - 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-lg ${page === i + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className={`px-3 py-1 rounded-lg ${page >= totalPages ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
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
