'use client'

import { useLanguage } from './providers/language-provider'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm ${
          language === 'en'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {t('language.en')}
      </button>
      <button
        onClick={() => setLanguage('ml')}
        className={`px-3 py-1 rounded-md text-sm ${
          language === 'ml'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {t('language.ml')}
      </button>
    </div>
  )
} 