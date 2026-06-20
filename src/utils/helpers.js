export const formatDate = date => {
  if (!date) {
    return 'N/A'
  }

  const [year, month, day] =
    date.split('-')

  return `${year}/${month}/${day}`
}

export const formatCurrency = amount =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)