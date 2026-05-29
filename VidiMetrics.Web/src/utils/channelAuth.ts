import { ChannelPlatform } from "@/types";

/**
 * Generates the connection or OAuth URL for a given social channel platform.
 * Currently, only YouTube (Google OAuth) is implemented. Other platforms
 * return placeholders/empty strings until their integrations are ready.
 * 
 * @param platform The social platform to connect
 * @param userId The current user's ID to preserve OAuth state flow
 * @returns The connection URL or a placeholder string if not implemented
 */
export function getChannelAuthUrl(platform: ChannelPlatform, userId: string): string {
  const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:7264";
  const ngrokUrl = import.meta.env.VITE_API_NGROK_URL || "https://truantly-toothiest-shenita.ngrok-free.dev";
  const currentFrontendUrl = window.location.href;
  const compositeState = `${userId}|${currentFrontendUrl}`;
  switch (platform) {
    case ChannelPlatform.YouTube: {
      const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
      const params = {
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
        redirect_uri: `${apiUrl}/api/integrations/callback/youtube`,
        response_type: "code",
        scope: [
          "https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube.readonly",
        ].join(" "),
        access_type: "offline",
        prompt: "consent",
        state: compositeState,
      };
      const queryString = new URLSearchParams(params).toString();
      return `${googleAuthUrl}?${queryString}`;
    }

    case ChannelPlatform.TikTok: {
      const tiktokAuthUrl = "https://www.tiktok.com/v2/auth/authorize/";
      const params = {
        client_key: import.meta.env.VITE_TIKTOK_CLIENT_KEY || "",
        redirect_uri: `${ngrokUrl}/api/integrations/callback/tiktok`,
        response_type: "code",
        scope: [
          "user.info.basic",
          "user.info.profile",
          "user.info.stats",
          "video.list",
          "video.upload"
        ].join(","),
        state: compositeState,
      };
      const queryString = new URLSearchParams(params).toString();
      return `${tiktokAuthUrl}?${queryString}`;
    }

    case ChannelPlatform.Instagram:
      // PLACEHOLDER: Instagram connection redirect endpoint (to be implemented)
      return `${apiUrl}/api/auth/instagram/connect-placeholder`;

    case ChannelPlatform.Facebook:
      // PLACEHOLDER: Facebook connection redirect endpoint (to be implemented)
      return `${apiUrl}/api/auth/facebook/connect-placeholder`;

    case ChannelPlatform.LinkedIn:
      // PLACEHOLDER: LinkedIn connection redirect endpoint (to be implemented)
      return `${apiUrl}/api/auth/linkedin/connect-placeholder`;

    case ChannelPlatform.X:
      // PLACEHOLDER: X connection redirect endpoint (to be implemented)
      return `${apiUrl}/api/auth/x/connect-placeholder`;

    case ChannelPlatform.Federated:
      // PLACEHOLDER: Federated connection redirect endpoint (to be implemented)
      return `${apiUrl}/api/auth/federated/connect-placeholder`;

    default:
      return "";
  }
}

/**
 * Helper to check if a social platform's integration is fully active and supported.
 * Currently, only YouTube is implemented.
 * 
 * @param platform The social platform to check
 * @returns boolean indicating if the integration is fully active
 */
export function isPlatformAuthImplemented(platform: ChannelPlatform): boolean {
  return platform === ChannelPlatform.YouTube || platform === ChannelPlatform.TikTok;
}
