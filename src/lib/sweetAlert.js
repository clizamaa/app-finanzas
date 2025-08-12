import Swal from 'sweetalert2'

// Configuración base para SweetAlert2
const baseConfig = {
  customClass: {
    confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors',
    cancelButton: 'bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors mr-2',
    popup: 'rounded-lg shadow-xl',
    title: 'text-gray-900 font-bold',
    content: 'text-gray-600'
  },
  buttonsStyling: false
}

// Alerta de éxito
export const showSuccess = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Entendido',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
    }
  })
}

// Alerta de error
export const showError = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Entendido',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
    }
  })
}

// Alerta de información
export const showInfo = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title,
    text,
    confirmButtonText: 'Entendido'
  })
}

// Alerta de confirmación
export const showConfirm = (title, text = '', confirmText = 'Sí, continuar', cancelText = 'Cancelar') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors',
      cancelButton: 'bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors mr-2'
    }
  })
}

// Alerta de eliminación
export const showDeleteConfirm = (itemName = 'este elemento') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title: '¿Estás seguro?',
    text: `¿Realmente quieres eliminar ${itemName}? Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors',
      cancelButton: 'bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors mr-2'
    }
  })
}

// Toast para notificaciones rápidas
export const showToast = (title, icon = 'success') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon,
    title,
    customClass: {
      popup: 'rounded-lg shadow-lg'
    }
  })
}

// Alerta de carga
export const showLoading = (title = 'Procesando...') => {
  return Swal.fire({
    ...baseConfig,
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

// Cerrar alerta de carga
export const closeLoading = () => {
  Swal.close()
}

export default Swal