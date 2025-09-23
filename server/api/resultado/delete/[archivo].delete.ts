export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const archivo = getRouterParam(event, 'archivo')

  try {
    await $fetch(`${apiBase}/resultado/cgo/delete/${archivo}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${secure?.token.access_token}`
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      data: error.data
    })
  }
})
