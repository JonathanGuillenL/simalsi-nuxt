export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const tipoCliente = body.tipoCliente || null

  let urlTipo = ''
  if (tipoCliente == 'CLIENTE_ESPONTANEO') {
      urlTipo = '/cliente/espontaneo'
  } else if (tipoCliente == 'MEDICO_AFILIADO') {
      urlTipo = '/cliente/medico'
  } else if (tipoCliente == 'CLINICA_AFILIADA') {
      urlTipo = '/cliente/clinica'
  }

  try {
    const data = await $fetch(`${apiBase}/${urlTipo}/${id}`, {
      method: 'PUT',
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
