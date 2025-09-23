export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')

  try {
    const data = await $fetch(`${apiBase}/caja/${id}/lamina/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secure?.token.access_token}`
      }
    })

    return data
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      data: error.data
    })
  }
})
