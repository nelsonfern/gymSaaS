import { DataTable } from "../components/DataTable";
import { usePaymentStore } from "../store/usePaymentStore";
import { useEffect } from "react";
import { PaymentRegis } from "../components/PaymentRegis";
import { History, BookOpenText } from "lucide-react";
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
  useEffect(() => {
    fetchPaymentsData();
  }, [fetchPaymentsData]);
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
            fetchAllData={async () => {
              const res = await api.get("/payments"); // sin page/limit → todos
              return res.data.data || [];
            }}
            columns={[
              {
                header: "CLIENTE",
                csvValue: (p) =>
                  `${p.client?.name ?? ""} ${p.client?.lastName ?? ""}`.trim(),
                render: (p) => (
                  <p className="font-normal text-gray-600 text-sm">
                    {p.client.name + " " + p.client.lastName}
                  </p>
                ),
              },
              {
                header: "PLAN",
                csvValue: (p) => p.plan?.name ?? "",
                render: (p) => (
                  <div className="flex items-center">
                    {" "}
                    <p className="font-semibold text-indigo-600 text-sm bg-indigo-100 p-2 rounded-md">
                      {p.plan.name}
                    </p>
                  </div>
                ),
              },
              {
                header: "MONTO",
                key: "amount",
                render: (p) => (
                  <p className="font-semibold text-gray-400 text-sm">
                    ${p.amount}
                  </p>
                ),
              },
              {
                header: "FECHA",
                csvValue: (p) =>
                  new Date(p.createdAt).toLocaleString("es-ES", opciones),
                render: (p) => (
                  <p className="font-semibold text-gray-400 text-sm">
                    {new Date(p.createdAt).toLocaleString("es-ES", opciones)}
                  </p>
                ),
              },
              {
                header: "MÉTODO",
                key: "method",
                render: (p) => (
                  <div className="flex items-center">
                    <p className="font-semibold text-gray-400 text-sm bg-gray-100 p-2 rounded-md">
                      {p.method.toUpperCase()}
                    </p>
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
