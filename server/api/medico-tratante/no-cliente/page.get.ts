export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const query = getQuery(event)

  const data = await $fetch<Page<PacientePageResponse>>(apiBase + '/medico-tratante/no-cliente', {
    query,
    headers: {
      Authorization: `Bearer ${secure?.token.access_token}`
    }
  })

  return data
})
