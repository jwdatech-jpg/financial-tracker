import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { transactionService } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'

export default function Transactions() {
  const { t } = useTranslation()
  const { currency } = useCurrency()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: 'never',
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getTransactions({})
      setTransactions(response.data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await transactionService.createTransaction(formData)
      fetchTransactions()
      setShowForm(false)
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        frequency: 'never',
      })
    } catch (error) {
      console.error('Failed to add transaction:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm(t('common.delete'))) {
      try {
        await transactionService.deleteTransaction(id)
        fetchTransactions()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('transactions.title')}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('transactions.addTransaction')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">{t('transactions.type')}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                >
                  <option value="income">{t('transactions.income')}</option>
                  <option value="expense">{t('transactions.expense')}</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{t('transactions.amount')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{t('transactions.category')}</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{t('transactions.date')}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{t('transactions.description')}</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
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
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">{t('transactions.date')}</th>
                <th className="px-4 py-3 text-left">{t('transactions.description')}</th>
                <th className="px-4 py-3 text-left">{t('transactions.category')}</th>
                <th className="px-4 py-3 text-left">{t('transactions.type')}</th>
                <th className="px-4 py-3 text-right">{t('transactions.amount')}</th>
                <th className="px-4 py-3 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{tx.description}</td>
                  <td className="px-4 py-3">{tx.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {t(`transactions.${tx.type}`)}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount), currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
