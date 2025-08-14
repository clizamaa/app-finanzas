'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logAccess, getActionFromPath, getArticleInfoFromPath } from '@/lib/logger'

const AccessTracker = ({ articleId = null, userId = null }) => {
  const pathname = usePathname()

  useEffect(() => {
    const trackAccess = async () => {
      try {
        const action = getActionFromPath(pathname)
        const articleInfo = getArticleInfoFromPath(pathname)
        
        const logData = {
          path: pathname,
          action,
          articleId: articleId || (articleInfo.isArticlePage ? articleInfo.slug : null),
          userId
        }

        await logAccess(pathname, action, logData)
      } catch (error) {
        console.error('Error tracking access:', error)
      }
    }

    // Pequeño delay para asegurar que la página se haya cargado completamente
    const timer = setTimeout(trackAccess, 1000)

    return () => clearTimeout(timer)
  }, [pathname, articleId, userId])

  // Este componente no renderiza nada
  return null
}

export default AccessTracker