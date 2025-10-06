export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig()
  const graphqlBase = runtimeConfig.graphqlBase

  const response = await $fetch<{
      data: HomeData
    }>(`${graphqlBase}/graphql`, {
    method: 'POST',
    body: {
      query: `
        query {
          count {
            solicitudCount {
              year
              month
              count
            }
            servicioRank {
              servicio
              cantidad
            }
            departamentoClinica {
              departamento
              count
            }
            totalClientes
            totalFacturas
            totalServicios
            totalSolicitudes
          }
        }
      `
    },
    headers: {
      Authorization: `Bearer ${secure?.token.access_token}`,
      ContentType: 'application/json'
    }
  })

  return response.data
})
