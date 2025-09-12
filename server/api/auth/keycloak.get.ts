import { parseJwt } from "../utils/parseJwt"

export default defineOAuthKeycloakEventHandler({
  async onSuccess(event, { user, tokens }) {
    const payload = parseJwt(tokens.access_token)

    await setUserSession(event, {
      user: { ...user, roles: payload.realm_access.roles },
      secure: {
        token: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: new Date(payload.exp * 1000)
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
