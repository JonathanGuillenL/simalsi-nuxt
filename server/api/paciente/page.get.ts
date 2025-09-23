export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const query = getQuery(event)

  console.log('secure', secure)

  const data = await $fetch<Page<PacientePageResponse>>(apiBase + '/paciente', {
    query,
    headers: {
      Authorization: `Bearer ${secure?.token.access_token}`
    }
  })

  return data
})
