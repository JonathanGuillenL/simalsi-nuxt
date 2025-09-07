export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const body = await readBody(event)

  try {
    const data = await $fetch<Page<PacienteCreateRequest> | any>(`${apiBase}/solicitud/cgo`, {
      method: 'POST',
      body: body,
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
