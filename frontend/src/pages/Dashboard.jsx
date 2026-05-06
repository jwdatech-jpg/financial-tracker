import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { dashboardService, accountService } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const { currency } = useCurrency()
  const [summary, setSummary] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  // Map English month abbreviations to translation keys
  const monthAbbrevToKey = {
    'Jan': 'jan', 'Feb': 'feb', 'Mar': 'mar', 'Apr': 'apr',
    'May': 'may_short', 'Jun': 'jun', 'Jul': 'jul', 'Aug': 'aug',
    'Sep': 'sep', 'Oct': 'oct', 'Nov': 'nov', 'Dec': 'dec'
  }

  useEffect(() => {
    fetchData()
  }, [i18n.language])

  const fetchData = async () => {
    try {
      const [summaryRes, chartRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getChartData('month'),
      ])
      setSummary(summaryRes.data)
      // Translate month names in chart data - backend provides correct month abbreviations
      const translatedChartData = chartRes.data.map((item) => {
        const monthKey = monthAbbrevToKey[item.month] || 'jan'
        return {
          ...item,
          month: t(`months.${monthKey}`),
          monthKey: monthKey
        }
      })
      setChartData(translatedChartData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  if (loading) return <div className="p-8">{t('common.loading')}</div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">{t('dashboard.totalBalance')}</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(summary?.total_balance || 0, currency)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">{t('dashboard.income')}</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(summary?.total_income || 0, currency)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">{t('dashboard.expenses')}</p>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(summary?.total_expenses || 0, currency)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">{t('dashboard.savings')}</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(summary?.savings || 0, currency)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{t('dashboard.trendAnalysis')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" name={t('dashboard.income')} fill="#10b981" />
              <Bar dataKey="expenses" name={t('dashboard.expenses')} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{t('dashboard.categoryBreakdown')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary?.category_breakdown || []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {(summary?.category_breakdown || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">{t('dashboard.recentTransactions')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">{t('transactions.date')}</th>
                <th className="px-4 py-2 text-left">{t('transactions.description')}</th>
                <th className="px-4 py-2 text-left">{t('transactions.category')}</th>
                <th className="px-4 py-2 text-right">{t('transactions.amount')}</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.recent_transactions || []).map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{tx.description}</td>
                  <td className="px-4 py-2">{tx.category}</td>
                  <td className={`px-4 py-2 text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount), currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
