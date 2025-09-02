export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  // limpiar sesión del cliente
  await clearUserSession(event)

  const serverUrl = runtimeConfig.oauth.keycloak.serverUrl
  const clientId = runtimeConfig.oauth.keycloak.clientId
  const realm = runtimeConfig.oauth.keycloak.realm
  const redirectUri = encodeURIComponent(runtimeConfig.public.appBase)
  // const idToken = session.secure?.token.id_token

  const keycloakLogoutUrl = `${serverUrl}/realms/${realm}/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=${redirectUri}`

  return sendRedirect(event, keycloakLogoutUrl)
})
