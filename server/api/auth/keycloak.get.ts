export default defineOAuthKeycloakEventHandler({
  async onSuccess(event, { user, tokens }) {
    const now = new Date()
    const time = now.getTime() + tokens.expires_in * 1000

    await setUserSession(event, {
      user,
      secure: {
        token: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: time
        }
      }
    }, {
      cookie: {
        httpOnly: true,
        maxAge: tokens.refresh_expires_in, // duración en segundos
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    })

    return sendRedirect(event, '/')
  },
  async onError(event, error) {
    console.error("OAuth Keycloak error:", error)
    return sendRedirect(event, '/login?error=auth_failed')
  }
})
