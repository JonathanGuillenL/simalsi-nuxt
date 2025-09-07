import Swal from 'sweetalert2'

export default defineNuxtPlugin((nuxtApp) => {
  const successAlert = (title: string, text?: string) => {
      return Swal.fire({
        icon: 'success',
        title,
        text,
        showConfirmButton: true,
        customClass: {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg'
        },
        buttonsStyling: false
      })
    }

    const errorAlert = (error: string | { message: string }) => {
      return Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: typeof error === 'string' ? error : error.message,
        customClass: {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg'
        },
      })
    }

    const confirmAlert = (title: string, text?: string) => {
      return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg',
          cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg'
        },
      })
    }

  nuxtApp.provide('swal', Swal);
  nuxtApp.provide('swalHelpers', { successAlert, errorAlert, confirmAlert });
})
