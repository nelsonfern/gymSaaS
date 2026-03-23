import { User } from "lucide-react";
import { Link } from "./Link";
export function RecentPayments({ data }) {
  const limit = 5;
  const payments = data.slice(0, limit);

  return (
    <>
      <div className=" rounded-xl  p-4">
        <div className="flex justify-between align-center">
          <h2 className="text-xl font-bold text-gray-700">Pagos Recientes</h2>
          <Link
            to="/payments"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Ver todos
          </Link>
        </div>
        <div className="mt-4  bg-white rounded-lg p-2 shadow-xs shadow-gray-200/50">
          {payments.map((payment, index) => (
            <ul key={index} role="list" className="divide-y divide-white/5">
              <li className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <User
                    size={24}
                    color="var(--color-indigo-500)"
                    className="size-12 flex-none rounded-full bg-gray-100 p-2"
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 font-semibold text-gray-500">
                      {payment.client.name + " " + payment.client.lastName}
                    </p>
                    <p className="mt-1 truncate text-xs/5 text-gray-400">
                      {payment.plan.name}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 font-semibold text-gray-500">
                    {payment.amount}
                  </p>
                  <p className="mt-1 truncate text-xs/5 text-gray-400">
                    {new Date(payment.paymentDate).toLocaleDateString([], {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </li>
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}
