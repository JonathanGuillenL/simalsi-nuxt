export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const query = getQuery(event)

  const data = await $fetch(apiBase + '/region-anatomica/list', {
    query,
    headers: {
      Authorization: `Bearer ${secure?.token.access_token}`
    }
  })

  return data
})
