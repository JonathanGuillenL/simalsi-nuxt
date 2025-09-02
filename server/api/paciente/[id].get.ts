export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')

  const data = await $fetch<Page<PacientePageResponse>>(`${apiBase}/paciente/${id}`, {
    headers: {
      Authorization: `Bearer ${secure?.token.access_token}`
    }
  })

  return data
})
