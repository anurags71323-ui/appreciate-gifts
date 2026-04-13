import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing, isLoggingIn } =
    useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principalText = isAuthenticated
    ? identity!.getPrincipal().toText()
    : null;

  // Derive a short display name from the principal
  const shortPrincipal = principalText
    ? `${principalText.slice(0, 5)}…${principalText.slice(-3)}`
    : null;

  return {
    identity,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    principalText,
    shortPrincipal,
    login,
    logout: clear,
  };
}
