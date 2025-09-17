export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const filename = getRouterParam(event, 'filename')

  const data = await $fetch<RegionAnatomicaResponse>(apiBase + '/resultado/cgo/download/' + filename, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${secure?.token.access_token}`
    }
  })

  return data
})
