const MINIO_ORIGIN = "http://localhost:9000";

export const DEFAULT_IMAGE = `${import.meta.env.BASE_URL}DefaultImage.png`;
export const DEFAULT_VIDEO = `${import.meta.env.BASE_URL}DefaultVideo.mp4`;

export const mediaUrl = (url: string, defaultUrl: string) => {
  if (!url) {
    return defaultUrl;
  }
  if (url.startsWith("/media/")) return import.meta.env.BASE_URL + url.slice(1);
  return url.startsWith(MINIO_ORIGIN) ? url.replace(MINIO_ORIGIN, "/minio") : url;
};
