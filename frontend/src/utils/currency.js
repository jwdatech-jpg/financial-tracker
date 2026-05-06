import { CURRENCY_SYMBOLS } from '../context/CurrencyContext'

export function formatCurrency(amount, currency = 'USD', locale = 'en') {
  const currencyInfo = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS['USD']
  
  try {
    const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formatter.format(amount)
  } catch (error) {
    // Fallback if Intl doesn't support the currency
    const formatted = amount.toFixed(2)
    return `${currencyInfo.symbol}${formatted}`
  }
}

export function getCurrencySymbol(currency) {
  return CURRENCY_SYMBOLS[currency]?.symbol || '$'
}

export function getCurrencyName(currency, language = 'en') {
  const currencyInfo = CURRENCY_SYMBOLS[currency]
  if (!currencyInfo) return currency
  return language === 'ar' ? currencyInfo.ar : currencyInfo.name
}
