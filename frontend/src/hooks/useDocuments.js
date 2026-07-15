import { useCallback, useEffect, useRef, useState } from 'react'
import { listDocuments } from '../lib/api'

const ACTIVE_STATUSES = new Set(['pending', 'processing'])

export function useDocuments() {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const refetch = useCallback(async () => {
    try {
      const data = await listDocuments()
      setDocuments(data)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    const hasActive = documents.some((doc) => ACTIVE_STATUSES.has(doc.status))

    if (hasActive && !intervalRef.current) {
      intervalRef.current = setInterval(refetch, 2000)
    } else if (!hasActive && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (!hasActive && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [documents, refetch])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const addDocument = useCallback((document) => {
    setDocuments((prev) => [document, ...prev])
  }, [])

  const removeDocument = useCallback((id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }, [])

  return { documents, isLoading, error, addDocument, removeDocument }
}
