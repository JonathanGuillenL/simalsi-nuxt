export default defineEventHandler(async (event) => {
  const { secure } = await getUserSession(event)
  const now = new Date()
  const expirationDate = secure? new Date(secure.token.expires_in) : now

  const runtimeConfig = useRuntimeConfig()
  const serverUrl = runtimeConfig.oauth.keycloak.serverUrl
  const clientId = runtimeConfig.oauth.keycloak.clientId
  const clientSecret = runtimeConfig.oauth.keycloak.clientSecret
  const realm = runtimeConfig.oauth.keycloak.realm

  console.log('actual ', now.toLocaleString('en-US', {
    timeZone: 'America/Managua'
  }))

  console.log('expire ', expirationDate.toLocaleString('en-US', {
    timeZone: 'America/Managua'
  }))

  if (expirationDate < now) {
    const response: RefreshTokenResponse = await $fetch(`${serverUrl}/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: secure?.token.refresh_token || ''
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const time = (new Date()).getTime() + (response.expires_in ?? 0) * 1000

    const session = await setUserSession(event, {
      secure: {
        token: {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          expires_in: time
        }
      }
    })

    console.log(session.secure)
  }
})
