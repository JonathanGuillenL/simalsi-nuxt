export default defineNuxtPlugin((nuxtApp) => {
  globalThis.$fetch = $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        console.error('Error 401: Sesión expirada o no autorizada.')

        nuxtApp.runWithContext(() => {
          const { clear } = useUserSession()
          clear()
          navigateTo('/')
        })
      }
    }
  })
})
