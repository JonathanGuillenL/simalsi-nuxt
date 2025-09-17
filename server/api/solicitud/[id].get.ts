export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  const data = await $fetch(apiBase + '/solicitud/cgo/' + id, {
    query,
    headers: {
      Authorization: `Bearer ${secure?.token.access_token}`
    }
  })

  return data
})
