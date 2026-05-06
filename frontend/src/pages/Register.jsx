import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

const COUNTRIES = [
  { code: 'US', name: 'United States', ar: 'الولايات المتحدة' },
  { code: 'SA', name: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
  { code: 'AE', name: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
  { code: 'EG', name: 'Egypt', ar: 'مصر' },
  { code: 'GB', name: 'United Kingdom', ar: 'المملكة المتحدة' },
  { code: 'CA', name: 'Canada', ar: 'كندا' },
  { code: 'AU', name: 'Australia', ar: 'أستراليا' },
  { code: 'JP', name: 'Japan', ar: 'اليابان' },
  { code: 'DE', name: 'Germany', ar: 'ألمانيا' },
  { code: 'FR', name: 'France', ar: 'فرنسا' },
]

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', ar: 'الدولار الأمريكي' },
  { code: 'EUR', symbol: '€', name: 'Euro', ar: 'اليورو' },
  { code: 'GBP', symbol: '£', name: 'British Pound', ar: 'الجنيه الإسترليني' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', ar: 'الريال السعودي' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', ar: 'الدرهم الإماراتي' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound', ar: 'الجنيه المصري' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar', ar: 'الدولار الكندي' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar', ar: 'الدولار الأسترالي' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', ar: 'الين الياباني' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', ar: 'الفرنك السويسري' },
]

export default function Register() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [country, setCountry] = useState('US')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }

    setLoading(true)

    try {
      await authService.register(email, password, name, currency, country)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">{t('auth.register')}</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">{t('profile.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.enterName')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.enterEmail')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-2 text-sm">{t('profile.currency')}</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary text-sm"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {i18n.language === 'en' ? c.name : c.ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm">{t('profile.country')}</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary text-sm"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {i18n.language === 'en' ? c.name : c.ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.enterPassword')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">{t('auth.confirmPassword')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('auth.confirmPassword')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? t('common.loading') : t('auth.register')}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-primary hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
