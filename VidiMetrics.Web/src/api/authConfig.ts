import { UserManager, WebStorageStateStore, UserManagerSettings } from "oidc-client-ts";

const oidcConfig: UserManagerSettings = {
    authority: import.meta.env.VITE_IDENTITY_SERVER_URL,
    client_id: import.meta.env.VITE_IDENTITY_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    post_logout_redirect_uri: window.location.origin, // http://localhost:5173
    response_type: "code",
    scope: "openid profile email roles offline_access vidimetrics_api",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    automaticSilentRenew: true,
    loadUserInfo: true,
    monitorSession: true,
};

export const authService = new UserManager(oidcConfig);