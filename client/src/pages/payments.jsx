import { DataTable } from "../components/DataTable";
import { usePaymentStore } from "../store/usePaymentStore";
import { useEffect } from "react";
import { PaymentRegis } from "../components/PaymentRegis";
import { History, BookOpenText } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

const opciones = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};
export default function Payments() {
  const payments = usePaymentStore((state) => state.payments);
  const fetchPaymentsData = usePaymentStore((state) => state.fetchPaymentsData);
  const page = usePaymentStore((state) => state.page);
  const totalPages = usePaymentStore((state) => state.totalPages);
  const isLoading = usePaymentStore((state) => state.isLoading);
  const paymentError = usePaymentStore((state) => state.error);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const searchParam = searchParams.get("search") || "";

    usePaymentStore.setState({
      page: pageParam,
      search: searchParam,
    });
    fetchPaymentsData();
  }, [searchParams]);
  return (
    <>
      <div className="flex flex-col p-6 pb-1 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Manejo de ingresos</h2>
            <p className="text-sm text-gray-400 font-normal w-2/3">
              Supervisión financiera precisa para "Tu gimnasio". Gestiona los
              pagos de los socios y realiza un seguimiento del rendimiento
              economico.
            </p>
          </div>
          <div className=" p-2 rounded-lg">
            <BookOpenText className="text-gray-200" size={100} />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/5">
          <PaymentRegis />
        </div>
        <div className="w-full md:w-3/5">
          <div className="flex flex-col p-6 pb-1 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <History className="text-indigo-600" size={32} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold ">Pagos</h2>
                <p className="text-xs text-gray-400 font-normal">
                  Lista de pagos
                </p>
              </div>
            </div>
          </div>
          <DataTable
            title="Historial de pagos"
            data={payments}
            page={page}
            totalPages={totalPages}
            isLoading={isLoading}
            error={paymentError}
            fetchAllData={async () => {
              const res = await api.get("/payments");
              return res.data.data || [];
            }}
            columns={[
              {
                header: "CLIENTE",
                csvValue: (p) =>
                  `${p.client?.name ?? ""} ${p.client?.lastName ?? ""}`.trim(),
                render: (p) => (
                  <p className="font-medium text-gray-700 text-sm">
                    {p.client?.name + " " + p.client?.lastName}
                  </p>
                ),
              },
              {
                header: "DESCRIPCIÓN",
                csvValue: (p) => {
                  const planName = p.plan?.name ?? "Sin plan";
                  return p.note ? `${planName} - ${p.note}` : planName;
                },
                render: (p) => (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700 text-sm">{p.plan?.name ?? "—"}</p>
                      {p.note && (
                        <p className="text-xs text-gray-400 font-normal">
                          {p.note}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                header: "FECHA",
                csvValue: (p) =>
                  new Date(p.createdAt).toLocaleDateString([], opciones),
                render: (p) => (
                  <p className="text-gray-400 text-sm font-medium">
                    {new Date(p.createdAt).toLocaleDateString([], opciones)}
                  </p>
                ),
              },
              {
                header: "MÉTODO",
                key: "method",
                csvValue: (p) => p.method.charAt(0).toUpperCase() + p.method.slice(1).toLowerCase(),
                render: (p) => (
                  <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-md inline-block">
                    {p.method.charAt(0).toUpperCase() + p.method.slice(1).toLowerCase()}
                  </span>
                ),
              },
              {
                header: "MONTO",
                key: "amount",
                csvValue: (p) => p.discount > 0 ? `$${p.amount} (Desc: -$${p.discount})` : `$${p.amount}`,
                render: (p) => (
                  <div className="text-right pr-4">
                    <p className="font-semibold text-gray-700 text-sm">
                      ${p.amount}
                    </p>
                    {p.discount > 0 && (
                      <p className="text-xs text-amber-500 font-medium">
                        -${p.discount.toFixed(2)} desc.
                      </p>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
