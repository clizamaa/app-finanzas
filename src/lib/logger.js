// Función para registrar logs de acceso
export const logAccess = async (path, action, options = {}) => {
  try {
    const logData = {
      path,
      action,
      ...options
    }

    // En el cliente, enviar al API
    if (typeof window !== 'undefined') {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      })
    }
  } catch (error) {
    console.error('Error logging access:', error)
  }
}

// Hook para usar en componentes de React
export const useAccessLogger = () => {
  const logPageView = (path, action, options = {}) => {
    logAccess(path, action, options)
  }

  return { logPageView }
}

// Función para obtener información del artículo desde la URL
export const getArticleInfoFromPath = (path) => {
  // Extraer slug del artículo de la URL
  const articleMatch = path.match(/\/articulos\/([^/?]+)/)
  if (articleMatch) {
    return {
      slug: articleMatch[1],
      isArticlePage: true
    }
  }
  return {
    slug: null,
    isArticlePage: false
  }
}

// Mapear rutas a acciones
export const getActionFromPath = (path) => {
  if (path === '/' || path === '') {
    return 'visit_home'
  }
  if (path === '/articulos' || path.startsWith('/articulos?')) {
    return 'visit_articles_list'
  }
  if (path.startsWith('/articulos/')) {
    return 'view_article'
  }
  if (path === '/reviews' || path.startsWith('/reviews?')) {
    return 'visit_reviews_list'
  }
  if (path.startsWith('/reviews/')) {
    return 'view_review'
  }
  if (path === '/tutoriales' || path.startsWith('/tutoriales?')) {
    return 'visit_tutorials_list'
  }
  if (path.startsWith('/tutoriales/')) {
    return 'view_tutorial'
  }
  if (path.startsWith('/admin')) {
    return 'admin_access'
  }
  return 'visit_page'
}