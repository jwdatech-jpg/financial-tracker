import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'

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

export default function Profile() {
  const { t, i18n } = useTranslation()
  const { updateCurrency } = useCurrency()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    currency: 'USD',
    country: 'US',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile()
      setProfile(response.data)
      setFormData({
        name: response.data.name || '',
        currency: response.data.currency || 'USD',
        country: response.data.country || 'US',
        password: '',
        confirmPassword: '',
      })
    } catch (err) {
      setError(t('profile.failedToLoad'))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }

    setSaving(true)
    try {
      const updateData = {
        name: formData.name,
        currency: formData.currency,
        country: formData.country,
      }
      
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await authService.updateProfile(updateData)
      setProfile(response.data)
      updateCurrency(response.data.currency)
      setEditing(false)
      setSuccess(t('profile.updatedSuccessfully'))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || t('profile.failedToUpdate'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">{t('common.loading')}</div>
  }

  const selectedCountry = COUNTRIES.find(c => c.code === formData.country)
  const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">{t('profile.title')}</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          {!editing ? (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <label className="text-gray-600 text-sm">{t('auth.email')}</label>
                <p className="text-lg font-semibold text-gray-900">{profile?.email}</p>
              </div>

              <div className="border-b pb-4">
                <label className="text-gray-600 text-sm">{t('profile.name')}</label>
                <p className="text-lg font-semibold text-gray-900">{profile?.name || t('profile.notSet')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <label className="text-gray-600 text-sm">{t('profile.currency')}</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile?.currency} - {CURRENCIES.find(c => c.code === profile?.currency)?.name}
                  </p>
                </div>
                <div>
                  <label className="text-gray-600 text-sm">{t('profile.country')}</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile?.country} - {COUNTRIES.find(c => c.code === profile?.country)?.name}
                  </p>
                </div>
              </div>

              <div className="border-b pb-4">
                <label className="text-gray-600 text-sm">{t('common.language')}</label>
                <p className="text-lg font-semibold text-gray-900">
                  {i18n.language === 'en' ? 'English' : 'العربية'}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {t('common.edit')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">{t('profile.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('profile.enterName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">{t('profile.currency')}</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {i18n.language === 'en' ? c.name : c.ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">{t('profile.country')}</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('profile.leaveBlankUnchanged')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">{t('auth.confirmPassword')}</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t('auth.confirmPassword')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {saving ? t('common.loading') : t('common.save')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
