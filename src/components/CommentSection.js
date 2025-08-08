'use client'

import Link from 'next/link'
import { MessageCircle, ThumbsUp, Reply, Send, Clock, User, Flag } from 'lucide-react'
import { useState, useEffect } from 'react'

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Datos de ejemplo - en producción vendrían de la API
  const sampleComments = [
    {
      id: 1,
      author: 'María González',
      content: 'Excelente artículo! He estado usando YNAB por 6 meses y realmente ha cambiado mi forma de manejar el dinero. La curva de aprendizaje vale la pena.',
      createdAt: '2024-01-16T10:30:00Z',
      likes: 12,
      replies: [
        {
          id: 2,
          author: 'Carlos Ruiz',
          content: '¿Cuánto tiempo te tomó acostumbrarte a la metodología de YNAB? Estoy considerando probarlo.',
          createdAt: '2024-01-16T11:15:00Z',
          likes: 3,
          parentId: 1
        },
        {
          id: 3,
          author: 'María González',
          content: '@Carlos Ruiz Aproximadamente 2-3 semanas para entender bien el sistema. Te recomiendo ver sus videos tutoriales, son muy útiles.',
          createdAt: '2024-01-16T12:00:00Z',
          likes: 5,
          parentId: 1
        }
      ]
    },
    {
      id: 4,
      author: 'Ana Martínez',
      content: 'Mint es genial para empezar, pero si quieres algo más avanzado definitivamente vale la pena invertir en una app premium. La automatización ahorra mucho tiempo.',
      createdAt: '2024-01-16T09:45:00Z',
      likes: 8,
      replies: []
    },
    {
      id: 5,
      author: 'Roberto Silva',
      content: 'Echo de menos que no mencionen PocketSmith. Para mí es la mejor opción para planificación a largo plazo. ¿Alguien más la ha probado?',
      createdAt: '2024-01-16T08:20:00Z',
      likes: 4,
      replies: [
        {
          id: 6,
          author: 'Laura Pérez',
          content: 'Sí! PocketSmith es excelente para proyecciones futuras. La uso junto con YNAB para tener lo mejor de ambos mundos.',
          createdAt: '2024-01-16T14:30:00Z',
          likes: 2,
          parentId: 5
        }
      ]
    }
  ]

  useEffect(() => {
    // Simular carga de comentarios
    setLoading(true)
    setTimeout(() => {
      setComments(sampleComments)
      setLoading(false)
    }, 500)
  }, [articleId])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace menos de 1 hora'
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    
    // Simular envío a API
    setTimeout(() => {
      const comment = {
        id: Date.now(),
        author: 'Usuario Anónimo',
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      }
      
      setComments([comment, ...comments])
      setNewComment('')
      setLoading(false)
    }, 1000)
  }

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setLoading(true)
    
    // Simular envío a API
    setTimeout(() => {
      const reply = {
        id: Date.now(),
        author: 'Usuario Anónimo',
        content: replyText,
        createdAt: new Date().toISOString(),
        likes: 0,
        parentId
      }
      
      const updatedComments = comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          }
        }
        return comment
      })
      
      setComments(updatedComments)
      setReplyText('')
      setReplyTo(null)
      setLoading(false)
    }, 1000)
  }

  const handleLike = (commentId, isReply = false, parentId = null) => {
    // Simular like - en producción sería una llamada a la API
    if (isReply) {
      const updatedComments = comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            )
          }
        }
        return comment
      })
      setComments(updatedComments)
    } else {
      const updatedComments = comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
      setComments(updatedComments)
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt)
    } else if (sortBy === 'popular') {
      return b.likes - a.likes
    }
    return 0
  })

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + comment.replies.length
  }, 0)

  return (
    <div className="bg-light-gray rounded-lg shadow-sm p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Comentarios ({totalComments})
          </h2>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="popular">Más populares</option>
        </select>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Agregar un comentario
          </label>
          <textarea
            id="comment"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Comparte tu opinión sobre este artículo..."
            required
          />
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Tu comentario será revisado antes de publicarse.
          </p>
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Enviando...' : 'Publicar comentario'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Cargando comentarios...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              {/* Main Comment */}
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {comment.likes}
                    </button>
                    
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Responder
                    </button>
                    
                    <button className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors duration-200">
                      <Flag className="h-4 w-4 mr-1" />
                      Reportar
                    </button>
                  </div>
                  
                  {/* Reply Form */}
                  {replyTo === comment.id && (
                    <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Escribe tu respuesta..."
                        required
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyTo(null)
                            setReplyText('')
                          }}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !replyText.trim()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {loading ? 'Enviando...' : 'Responder'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
              
              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-14 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-medium text-gray-900">{reply.author}</h5>
                          <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{reply.content}</p>
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(reply.id, true, comment.id)}
                            className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {reply.likes}
                          </button>
                          
                          <button className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors duration-200">
                            <Flag className="h-4 w-4 mr-1" />
                            Reportar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {comments.length === 0 && !loading && (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Sé el primero en comentar este artículo</p>
        </div>
      )}
    </div>
  )
}

export default CommentSection