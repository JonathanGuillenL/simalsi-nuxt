export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // limpiar sesión del cliente
  await clearUserSession(event)

  const clientId = 'quarkus-app'
  const redirectUri = encodeURIComponent('http://localhost:3000/')
  const idToken = session?.id_token

  const keycloakLogoutUrl = `http://localhost:8180/realms/SIMALSI/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=${redirectUri}&id_token_hint=${idToken}`

  return sendRedirect(event, keycloakLogoutUrl)
})
