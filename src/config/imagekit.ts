import ImageKit from "imagekit";
import { env } from "./env";

export const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY || "dummy_public_key",
  privateKey: env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key",
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/demoname",
});
