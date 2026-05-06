import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const CurrencyContext = createContext()

export const CURRENCY_SYMBOLS = {
  USD: { symbol: '$', name: 'US Dollar', ar: 'الدولار الأمريكي' },
  EUR: { symbol: '€', name: 'Euro', ar: 'اليورو' },
  GBP: { symbol: '£', name: 'British Pound', ar: 'الجنيه الإسترليني' },
  SAR: { symbol: '﷼', name: 'Saudi Riyal', ar: 'الريال السعودي' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', ar: 'الدرهم الإماراتي' },
  EGP: { symbol: '£', name: 'Egyptian Pound', ar: 'الجنيه المصري' },
  CAD: { symbol: '$', name: 'Canadian Dollar', ar: 'الدولار الكندي' },
  AUD: { symbol: '$', name: 'Australian Dollar', ar: 'الدولار الأسترالي' },
  JPY: { symbol: '¥', name: 'Japanese Yen', ar: 'الين الياباني' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', ar: 'الفرنك السويسري' },
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadUserCurrency()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUserCurrency = async () => {
    try {
      const response = await authService.getProfile()
      setCurrency(response.data.currency || 'USD')
    } catch (error) {
      console.error('Failed to load currency:', error)
      setCurrency('USD')
    } finally {
      setLoading(false)
    }
  }

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, loading, updateCurrency, currencySymbols: CURRENCY_SYMBOLS }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}
