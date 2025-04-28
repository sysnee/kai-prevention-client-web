import { RequestOptions } from 'http'
import { getSession, signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import { handleLogout } from '@/app/utils/auth'
// Extend the Session type to include accessToken
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    userId?: string;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'

async function handleResponse(response: Response) {
  if (response.status === 401 || response.status === 403) {
    await handleLogout()
  }

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || `Error: ${response.status}`)
  }

  if (response.headers.get('content-type')?.includes('application/pdf')) {
    return response.blob()
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export const apiCall = async (url: string, options: RequestOptions & { body?: any; params?: any; responseType?: 'blob' | 'json' | 'text' }) => {
  const { method, headers = {}, body = null, params = {}, responseType } = options
  const session = await getSession() as Session | null

  if (!session?.accessToken) {
    // No valid session, redirect to login
    signIn(undefined, { callbackUrl: '/auth/login' })
    throw new Error('No valid session found')
  }

  // Build the request URL with query parameters
  const queryString = new URLSearchParams(params).toString()
  const isUrlAbsolute = url.startsWith('http')
  let fullUrl
  if (isUrlAbsolute) {
    fullUrl = url
  } else {
    const normalizedPath = url.startsWith('/') ? url : `/${url}`
    const normalizedBaseUrl = API_BASE_URL.endsWith('/')
      ? API_BASE_URL.slice(0, -1)
      : API_BASE_URL
    fullUrl = `${normalizedBaseUrl}${normalizedPath}${queryString ? `?${queryString}` : ''}`
  }

  // Prepare fetch options
  const fetchOptions = {
    method,
    body,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
      ...headers
    }
  }

  if (responseType === 'blob') {
    delete fetchOptions.headers['Content-Type']
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(fullUrl, fetchOptions as RequestInit)
    return await handleResponse(response)
  } catch (error: any) {
    const errorMessage = error.message || 'Network error'
    throw new Error(`API Error: ${errorMessage}`)
  }
}

export default {
  get: async (url: string, options?: any) => apiCall(url, { method: 'GET', ...options }),
  post: async (url: string, body?: any, options?: any) => apiCall(url, { method: 'POST', body, ...options, }),
  put: async (url: string, body?: any, options?: any) => apiCall(url, { method: 'PUT', body, ...options }),
  delete: async (url: string, options?: any) => apiCall(url, { method: 'DELETE', ...options }),
  patch: async (url: string, body?: any, options?: any) => apiCall(url, { method: 'PATCH', body, ...options })
}
