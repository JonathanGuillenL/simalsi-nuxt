import Swal from 'sweetalert2'

declare module '#app' {
  interface NuxtApp {
    $swal: typeof Swal
    $swalHelpers: {
      successAlert: (title: string, text?: string) => Promise<any>
      errorAlert: (error: string | { message: string }) => Promise<any>
      confirmAlert: (title: string, text?: string) => Promise<any>
    }
  }
}

/*declare module 'vue' {
  interface ComponentCustomProperties {
    $swal: typeof Swal
  }
}*/
