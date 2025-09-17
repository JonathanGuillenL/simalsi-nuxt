export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.apiBase
  const { secure } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const parts = await readMultipartFormData(event)
  const formData = new FormData()

  if (!parts) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No se encontraron datos multipart/form-data.',
    });
  }

  // Agrega cada parte del formulario a un nuevo objeto FormData
  for (const part of parts) {
    if (part.filename && part.name) {
      const fileBlob = new Blob([part.data as BlobPart], { type: part.type })
      formData.append(part.name, fileBlob, part.filename)
    } else if(part.name) {
      const fileBlob = new Blob([part.data as BlobPart], { type: part.type })
      formData.append(part.name, fileBlob)
    }
  }

  try {
    const data = await $fetch<AdjuntarArchivoResponse>(`${apiBase}/resultado/cgo/upload/${id}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${secure?.token.access_token}`
      }
    })

    return data
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      data: error.data
    })
  }
})
