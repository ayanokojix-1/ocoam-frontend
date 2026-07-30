import { ArrowLeft } from 'lucide-react';
import feesData from '../data/fees.json';

export default function FeeSchedule() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 space-y-10">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-green-900 mb-2">Fee Schedule</h1>
            <p className="text-gray-600">
              {feesData.programme} &middot; {feesData.institution}
            </p>
            <p className="text-sm text-gray-500 mt-3 max-w-xl mx-auto">
              This page is for your reference only. Your track and payment timeline are confirmed as part of your
              application — nothing here needs to be selected.
            </p>
          </header>

          {feesData.note && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm text-amber-800">
              {feesData.note}
            </div>
          )}

          <div>
            <h3 className="font-bold text-green-900 mb-3">Tuition Totals</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Track</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Total Fee</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(feesData.tuition).map(([key, t]) => (
                    <tr key={key} className="even:bg-gray-50">
                      <td className="px-4 py-2 align-top font-medium text-gray-800">{t.name}</td>
                      <td className="px-4 py-2 align-top text-gray-700 whitespace-nowrap">{t.total_fee_display}</td>
                      <td className="px-4 py-2 align-top text-gray-500 text-xs">{t.price_note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(feesData.payment_options).map(([key, po]) => (
              <div key={key}>
                <h3 className="font-bold text-green-900 mb-3">
                  {feesData.tuition[key]?.name || key} &mdash; Payment Timeline Options
                </h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Timeline</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Instalment</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Amount</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">When Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {po.plans.flatMap((plan, i) =>
                        plan.instalments.map((inst, j) => (
                          <tr key={`${i}-${j}`} className="even:bg-gray-50">
                            {j === 0 && (
                              <td
                                rowSpan={plan.instalments.length}
                                className="px-4 py-2 align-top font-medium text-gray-800 border-r border-gray-100 whitespace-nowrap"
                              >
                                {plan.plan}
                              </td>
                            )}
                            <td className="px-4 py-2 align-top text-gray-700">{inst.label}</td>
                            <td className="px-4 py-2 align-top text-gray-700 whitespace-nowrap">
                              &#8358;{inst.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 align-top text-gray-500">{inst.when_due}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-bold text-green-900 mb-3">Payment Rules</h3>
            <ul className="space-y-2 list-disc list-inside text-sm text-gray-700">
              {feesData.payment_rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-2">
            <a
              href="/form"
              className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Application
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
