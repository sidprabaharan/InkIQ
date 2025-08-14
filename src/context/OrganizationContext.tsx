import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '@/lib/supabase'

interface Organization {
  org_id: string
  org_name: string
  org_slug: string
  user_role: string
  org_settings: any
  member_count: number
}

interface OrganizationContextType {
  organization: Organization | null
  loading: boolean
  error: string | null
  refreshOrganization: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}

interface OrganizationProviderProps {
  children: React.ReactNode
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchOrganization = async () => {
    if (!user) {
      setOrganization(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('get_user_org_info')

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        setOrganization(data[0])
      } else {
        setOrganization(null)
      }
    } catch (err) {
      console.error('Error fetching organization:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch organization')
    } finally {
      setLoading(false)
    }
  }

  const refreshOrganization = async () => {
    await fetchOrganization()
  }

  useEffect(() => {
    fetchOrganization()
  }, [user])

  const value = {
    organization,
    loading,
    error,
    refreshOrganization,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

