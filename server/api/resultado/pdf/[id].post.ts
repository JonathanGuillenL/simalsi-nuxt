export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')

  try {
    let location: string | null = null
    await $fetch(`${apiBase}/resultado/cgo/generate-token/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secure?.token.access_token}`
      },
      onResponse: ({ response }) => {
        if (response.headers.has('location')) {
          location = response.headers.get('location')
        }
      }
    })

    return location
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      data: error.data
    })
  }
})
