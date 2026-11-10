const MINIO_ORIGIN = "http://localhost:9000";

export const DEFAULT_IMAGE = "/DefaultImage.png";
export const DEFAULT_VIDEO = "/DefaultVideo.mp4";

export const mediaUrl = (url: string, defaultUrl: string) => {
  if (!url) {
    return defaultUrl;
  }
  return url.startsWith(MINIO_ORIGIN) ? url.replace(MINIO_ORIGIN, "/minio") : url;
};
