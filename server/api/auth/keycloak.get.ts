export default defineOAuthKeycloakEventHandler({
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, { user, id_token: tokens?.id_token, access_token: tokens?.access_token })
    return sendRedirect(event, '/')
  },
  async onError(event, error) {
    console.error("OAuth Keycloak error:", error)
    return sendRedirect(event, '/login?error=auth_failed')
  }
})
