import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { accountService } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'

export default function Accounts() {
  const { t } = useTranslation()
  const { currency } = useCurrency()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    balance: '',
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAccounts()
      setAccounts(response.data)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await accountService.createAccount({
        name: formData.name,
        type: formData.type,
        initial_balance: parseFloat(formData.balance),
      })
      fetchAccounts()
      setShowForm(false)
      setFormData({ name: '', type: 'bank', balance: '' })
    } catch (error) {
      console.error('Failed to add account:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm(t('common.delete'))) {
      try {
        await accountService.deleteAccount(id)
        fetchAccounts()
      } catch (error) {
        console.error('Failed to delete account:', error)
      }
    }
  }

  const getAccountIcon = (type) => {
    const icons = {
      cash: '💵',
      bank: '🏦',
      creditCard: '💳',
      savings: '🏧',
    }
    return icons[type] || '📊'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('accounts.title')}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('accounts.addAccount')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">{t('accounts.accountName')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{t('accounts.accountType')}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                >
                  <option value="cash">{t('accounts.cash')}</option>
                  <option value="bank">{t('accounts.bank')}</option>
                  <option value="creditCard">{t('accounts.creditCard')}</option>
                  <option value="savings">{t('accounts.savings')}</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{t('accounts.initialBalance')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: e.target.value})}
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
          {accounts.map((account) => (
            <div key={account.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-3xl mb-2">{getAccountIcon(account.type)}</div>
                  <h3 className="text-xl font-bold">{account.name}</h3>
                  <p className="text-gray-600">{t(`accounts.${account.type}`)}</p>
                </div>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="text-red-600 hover:text-red-800 transition text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="border-t pt-4">
                <p className="text-gray-600">{t('accounts.balance')}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(account.balance, currency)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
