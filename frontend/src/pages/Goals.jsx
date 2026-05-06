import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { goalsService } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'

export default function Goals() {
  const { t } = useTranslation()
  const { currency } = useCurrency()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await goalsService.getGoals()
      setGoals(response.data)
    } catch (error) {
      console.error('Failed to fetch goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await goalsService.createGoal({
        name: formData.name,
        target_amount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
      })
      fetchGoals()
      setShowForm(false)
      setFormData({ name: '', targetAmount: '', deadline: '' })
    } catch (error) {
      console.error('Failed to add goal:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm(t('common.delete'))) {
      try {
        await goalsService.deleteGoal(id)
        fetchGoals()
      } catch (error) {
        console.error('Failed to delete goal:', error)
      }
    }
  }

  const calculateDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('goals.title')}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('goals.addGoal')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">{t('goals.goalName')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{t('goals.targetAmount')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{t('goals.deadline')}</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100
            const daysRemaining = calculateDaysRemaining(goal.deadline)
            const isAchieved = progress >= 100

            return (
              <div key={goal.id} className={`p-6 rounded-lg shadow ${isAchieved ? 'bg-green-50' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{goal.name}</h3>
                    <p className="text-gray-600">
                      {formatCurrency(goal.current_amount, currency)} / {formatCurrency(goal.target_amount, currency)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    {t('common.delete')}
                  </button>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  {progress.toFixed(0)}% {t('goals.progress')}
                </div>

                <div className="text-sm text-gray-600">
                  {daysRemaining > 0 
                    ? `${daysRemaining} ${t('goals.daysRemaining')}`
                    : t('goals.deadline')
                  }
                </div>

                {isAchieved && (
                  <div className="mt-4 p-2 bg-green-200 text-green-800 rounded text-sm font-semibold">
                    ✓ {t('goals.goalAchieved')}
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
