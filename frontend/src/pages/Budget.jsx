import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { budgetService } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'

export default function Budget() {
  const { t } = useTranslation()
  const { currency } = useCurrency()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
  })

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const response = await budgetService.getBudgets()
      setBudgets(response.data)
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await budgetService.createBudget({
        category: formData.category,
        limit: parseFloat(formData.limit),
      })
      fetchBudgets()
      setShowForm(false)
      setFormData({ category: '', limit: '' })
    } catch (error) {
      console.error('Failed to add budget:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm(t('common.delete'))) {
      try {
        await budgetService.deleteBudget(id)
        fetchBudgets()
      } catch (error) {
        console.error('Failed to delete budget:', error)
      }
    }
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('budget.title')}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('budget.addBudget')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">{t('budget.budgetName')}</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{t('budget.budgetLimit')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.limit}
                  onChange={(e) => setFormData({...formData, limit: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                {t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div>{t('common.loading')}</div>
      ) : (
        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100
            return (
              <div key={budget.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{budget.category}</h3>
                    <p className="text-gray-600">
                      {t('budget.spent')}: {formatCurrency(budget.spent, currency)} / {t('budget.remaining')}: {formatCurrency(budget.limit - budget.spent, currency)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    {t('common.delete')}
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(percentage)} transition-all`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="mt-2 text-right text-sm text-gray-600">
                  {percentage.toFixed(0)}% of {formatCurrency(budget.limit, currency)}
                </div>
                {percentage >= 80 && (
                  <div className="mt-2 text-yellow-600 text-sm font-semibold">
                    {percentage >= 100 ? t('budget.exceeded') : t('budget.alert')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
