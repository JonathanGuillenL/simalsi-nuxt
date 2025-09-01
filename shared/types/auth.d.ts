declare module '#auth-utils' {
  interface User {
    sub: string
    name: string
    preferred_username: string
    given_name: string
    email: string
    roles: string[]
  }

  interface SecureSessionData {
    token: {
      id_token: string
      access_token: string
      refresh_token: string
      scope: string
      expires_in: number
    }
  }
}

export {}
