'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Gothram {
  id: number
  nameEn: string
  nameMl: string
}

export default function GothramPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const [gothrams, setGothrams] = useState<Gothram[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingGothram, setEditingGothram] = useState<Gothram | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchGothrams()
  }, [])

  const fetchGothrams = async () => {
    try {
      const response = await fetch('/api/gothram')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('gothram.error.fetch'))
      }
      const data = await response.json()
      setGothrams(data)
      setError('')
    } catch (error) {
      setError(error instanceof Error ? error.message : t('gothram.error.fetch'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    const data = {
      nameEn: (formData.get('nameEn') as string).trim(),
      nameMl: (formData.get('nameMl') as string).trim(),
    }

    if (!data.nameEn || !data.nameMl) {
      const missingFields = []
      if (!data.nameEn) missingFields.push('English name')
      if (!data.nameMl) missingFields.push('Malayalam name')
      setError(`Please enter ${missingFields.join(' and ')}`)
      return
    }

    if (data.nameEn.length > 200 || data.nameMl.length > 200) {
      setError('Name length cannot exceed 200 characters')
      return
    }

    try {
      if (editingGothram) {
        const response = await fetch(`/api/gothram/${editingGothram.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.error || t('gothram.error.update'))
        }
      } else {
        const response = await fetch('/api/gothram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.error || t('gothram.error.create'))
        }
      }

      await fetchGothrams()
      setIsEditing(false)
      setEditingGothram(null)
    } catch (error) {
      console.error('Form submission error:', error)
      setError(error instanceof Error ? error.message : editingGothram ? t('gothram.error.update') : t('gothram.error.create'))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('gothram.confirmDelete'))) return

    try {
      const response = await fetch(`/api/gothram/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('gothram.error.delete'))
      }
      await fetchGothrams()
    } catch (error) {
      setError(error instanceof Error ? error.message : t('gothram.error.delete'))
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('gothram.title')}</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {t('gothram.add')}
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          )}

          {isEditing && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
              <div>
                <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700">
                  {t('gothram.nameEn')}
                </label>
                <input
                  type="text"
                  name="nameEn"
                  id="nameEn"
                  required
                  defaultValue={editingGothram?.nameEn}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="nameMl" className="block text-sm font-medium text-gray-700">
                  {t('gothram.nameMl')}
                </label>
                <input
                  type="text"
                  name="nameMl"
                  id="nameMl"
                  required
                  defaultValue={editingGothram?.nameMl}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {t('gothram.save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditingGothram(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {t('gothram.cancel')}
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('gothram.nameEn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('gothram.nameMl')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('gothram.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gothrams.map((gothram) => (
                  <tr key={gothram.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {gothram.nameEn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {gothram.nameMl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingGothram(gothram)
                          setIsEditing(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        {t('gothram.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(gothram.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('gothram.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 