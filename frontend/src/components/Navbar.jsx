import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const [dropdown, setDropdown] = useState(false)

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    await i18n.changeLanguage(newLang)
    // Persist language preference to backend
    localStorage.setItem('language', newLang)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary">{t('common.appName')}</h1>
            <div className="hidden md:flex gap-6">
              <a href="/" className="text-gray-600 hover:text-primary transition">{t('dashboard.title')}</a>
              <a href="/transactions" className="text-gray-600 hover:text-primary transition">{t('transactions.title')}</a>
              <a href="/accounts" className="text-gray-600 hover:text-primary transition">{t('accounts.title')}</a>
              <a href="/budget" className="text-gray-600 hover:text-primary transition">{t('budget.title')}</a>
              <a href="/goals" className="text-gray-600 hover:text-primary transition">{t('goals.title')}</a>
              <a href="/profile" className="text-gray-600 hover:text-primary transition">{t('profile.title')}</a>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-700 transition"
            >
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </button>

            <button
              onClick={() => setDropdown(!dropdown)}
              className="text-gray-600 hover:text-primary transition"
            >
              ⚙️
            </button>

            {dropdown && (
              <div className="absolute right-0 top-14 bg-white border rounded shadow-lg">
                <a
                  href="/profile"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {t('profile.title')}
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
