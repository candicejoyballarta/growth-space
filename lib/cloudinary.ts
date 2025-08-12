import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error(
    "CLOUDINARY_CLOUD_NAME is not set in the environment variables"
  );
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set in the environment variables");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error(
    "CLOUDINARY_API_SECRET is not set in the environment variables"
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image: File): Promise<string> {
  const imageData = await image.arrayBuffer();
  const mime = image.type || "image/jpeg";
  const encoding = "base64";
  const base64Data = Buffer.from(imageData).toString(encoding);
  const fileUri = `data:${mime};${encoding},${base64Data}`;
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: "growth-space",
    resource_type: "image",
  });

  return result.secure_url;
}
