'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'ml'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [translations, setTranslations] = useState<Record<string, any>>({})

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language
    if (storedLang) {
      setLanguage(storedLang)
    }
  }, [])

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await import(`@/i18n/locales/${language}.json`)
        setTranslations(translations)
        localStorage.setItem('language', language)
      } catch (error) {
        console.error('Error loading translations:', error)
      }
    }

    loadTranslations()
  }, [language])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      value = value?.[k]
      if (!value) break
    }

    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 