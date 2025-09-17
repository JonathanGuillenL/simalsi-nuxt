export default function() {
  function isAuthorized(userRole: string, roles: unknown[]) {
    return roles.includes(userRole)
  }

  return {
    isAuthorized
  }
}
