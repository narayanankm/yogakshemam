'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Vedam {
  id: number
  nameEn: string
  nameMl: string
}

export default function VedamPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const [vedams, setVedams] = useState<Vedam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingVedam, setEditingVedam] = useState<Vedam | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchVedams()
  }, [])

  const fetchVedams = async () => {
    try {
      const response = await fetch('/api/vedam')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('vedam.error.fetch'))
      }
      const data = await response.json()
      setVedams(data)
      setError('')
    } catch (error) {
      setError(error instanceof Error ? error.message : t('vedam.error.fetch'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    const data = {
      nameEn: formData.get('nameEn') as string,
      nameMl: formData.get('nameMl') as string,
    }

    try {
      if (editingVedam) {
        const response = await fetch(`/api/vedam/${editingVedam.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || t('vedam.error.update'))
        }
      } else {
        const response = await fetch('/api/vedam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || t('vedam.error.create'))
        }
      }

      await fetchVedams()
      setIsEditing(false)
      setEditingVedam(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : editingVedam ? t('vedam.error.update') : t('vedam.error.create'))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('vedam.confirmDelete'))) return

    try {
      const response = await fetch(`/api/vedam/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('vedam.error.delete'))
      }
      await fetchVedams()
    } catch (error) {
      setError(error instanceof Error ? error.message : t('vedam.error.delete'))
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
            <h1 className="text-2xl font-bold text-gray-900">{t('vedam.title')}</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {t('vedam.add')}
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
                  {t('vedam.nameEn')}
                </label>
                <input
                  type="text"
                  name="nameEn"
                  id="nameEn"
                  required
                  defaultValue={editingVedam?.nameEn}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="nameMl" className="block text-sm font-medium text-gray-700">
                  {t('vedam.nameMl')}
                </label>
                <input
                  type="text"
                  name="nameMl"
                  id="nameMl"
                  required
                  defaultValue={editingVedam?.nameMl}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {t('vedam.save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditingVedam(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {t('vedam.cancel')}
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vedam.nameEn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vedam.nameMl')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vedam.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vedams.map((vedam) => (
                  <tr key={vedam.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vedam.nameEn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vedam.nameMl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingVedam(vedam)
                          setIsEditing(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        {t('vedam.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(vedam.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('vedam.delete')}
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