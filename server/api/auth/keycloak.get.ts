export default defineOAuthKeycloakEventHandler({
  async onSuccess(event, { user, tokens }) {
    const now = new Date()
    const time = now.getTime() + tokens.expires_in * 1000

    function parseJwt (token: string) {
      try {
        const base64Url = token.split('.')[1]  // payload is the 2nd part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )

        return JSON.parse(jsonPayload)
      } catch (e) {
        console.error("Invalid token", e)
        return null
      }
    }

    const payload = parseJwt(tokens.access_token)

    await setUserSession(event, {
      user: { ...user, roles: payload.realm_access.roles },
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
