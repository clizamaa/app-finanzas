'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Importar Quill dinámicamente para evitar errores de SSR
const QuillEditor = ({ value, onChange, placeholder = 'Escribe tu contenido aquí...' }) => {
  const quillRef = useRef(null)
  const quillInstanceRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window !== 'undefined' && quillRef.current && !quillInstanceRef.current) {
        // Limpiar completamente el contenedor
        quillRef.current.innerHTML = ''
        
        const { default: Quill } = await import('quill')
        await import('quill/dist/quill.snow.css')
        
        // Importar y registrar quill-better-table-plus
        const { default: QuillBetterTablePlus } = await import('quill-better-table-plus')
        await import('quill-better-table-plus/dist/quill-better-table-plus.css')
        
        // Registrar el módulo y sus formatos
        Quill.register({
          'modules/better-table-plus': QuillBetterTablePlus
        }, true)
        
        // Registrar manualmente los formatos que el plugin necesita
        QuillBetterTablePlus.register()
        
        // Configurar Quill
        const quillInstance = new Quill(quillRef.current, {
          theme: 'snow',
          placeholder,
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'align': [] }],
              ['blockquote', 'code-block'],
              ['link', 'image'],
              ['better-table-plus'],
              ['clean']
            ],
            table: false, // Desactivar módulo de tabla nativo
            'better-table-plus': {
              operationMenu: {
                items: {
                  unmergeCells: {
                    text: 'Separar celdas'
                  },
                  insertColumnLeft: {
                    text: 'Insertar columna a la izquierda'
                  },
                  insertColumnRight: {
                    text: 'Insertar columna a la derecha'
                  },
                  insertRowUp: {
                    text: 'Insertar fila arriba'
                  },
                  insertRowDown: {
                    text: 'Insertar fila abajo'
                  },
                  mergeCells: {
                    text: 'Combinar celdas'
                  },
                  deleteColumn: {
                    text: 'Eliminar columna'
                  },
                  deleteRow: {
                    text: 'Eliminar fila'
                  },
                  deleteTable: {
                    text: 'Eliminar tabla'
                  }
                }
              }
            },
            keyboard: {
              bindings: QuillBetterTablePlus.keyboardBindings
            }
          }
        })

        // Añadir handler para botón de toolbar 'better-table-plus'
        const toolbarModule = quillInstance.getModule('toolbar')
        if (toolbarModule) {
          toolbarModule.addHandler('better-table-plus', () => {
            const tableModule = quillInstance.getModule('better-table-plus')
            if (tableModule && typeof tableModule.insertTable === 'function') {
              tableModule.insertTable(3, 3)
            }
          })
        }

        // Configurar el contenido inicial
        if (value) {
          quillInstance.root.innerHTML = value
        }

        // Escuchar cambios
        quillInstance.on('text-change', () => {
          const html = quillInstance.root.innerHTML
          onChange(html)
        })

        quillInstanceRef.current = quillInstance
        setIsLoaded(true)
      }
    }

    loadQuill()

    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.off('text-change')
        // Destruir completamente la instancia
        if (quillRef.current) {
          quillRef.current.innerHTML = ''
        }
        quillInstanceRef.current = null
        setIsLoaded(false)
      }
    }
  }, [])

  // Actualizar contenido cuando cambie el valor externo
  useEffect(() => {
    if (quillInstanceRef.current && value !== quillInstanceRef.current.root.innerHTML) {
      quillInstanceRef.current.root.innerHTML = value || ''
    }
  }, [value])

  return (
    <div className="quill-editor-container">
      <div ref={quillRef} style={{ minHeight: '400px' }} />
      {!isLoaded && (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando editor...</p>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .quill-editor-container {
          position: relative;
        }
        
        .quill-editor-container .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
        }
        
        .quill-editor-container .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-top: none;
          border-radius: 0 0 8px 8px;
          font-family: inherit;
        }
        
        .quill-editor-container .ql-editor {
          min-height: 400px;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .quill-editor-container .ql-editor.ql-blank::before {
          font-style: normal;
          color: #999;
        }
        
        .quill-editor-container .ql-snow .ql-tooltip {
          z-index: 1000;
        }
        
        /* Prevenir barras de herramientas duplicadas */
          .quill-editor-container .ql-toolbar + .ql-toolbar {
            display: none !important;
          }
        
        /* Estilos básicos de tablas para que se vean bien al pegar */
        .quill-editor-container table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .quill-editor-container table td,
        .quill-editor-container table th {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
        }
        .quill-editor-container table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .quill-editor-container table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .quill-editor-container table tr:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  )
}

// Exportar como componente dinámico para evitar errores de SSR
export default dynamic(() => Promise.resolve(QuillEditor), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-300">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Cargando editor...</p>
      </div>
    </div>
  )
})