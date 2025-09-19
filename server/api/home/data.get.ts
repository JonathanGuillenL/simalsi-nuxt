export default defineEventHandler(async (event) => {
  const { user, access_token } = await getUserSession(event);

  const data = await $fetch<{
    data: { count: { solicitudCount: { estado: string, cantidad: number }[] } }
    }>('http://localhost:8080/graphql', {
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
          }
        }
      `
    },
    headers: {
      ContentType: 'application/json'
    }
  })

  return data.data.count.solicitudCount
})
