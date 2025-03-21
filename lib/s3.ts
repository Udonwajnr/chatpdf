import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  try {
    const s3 = new S3({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!, //  REMOVE NEXT_PUBLIC_
        secretAccessKey: process.env.NEXT_PUBLIC_3_SECRET_ACCESS_KEY!,
      },
    });

    const file_key = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const arrayBuffer = await file.arrayBuffer(); // Convert File to Buffer

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!, // 🔴 REMOVE NEXT_PUBLIC_
      Key: file_key,
      Body: Buffer.from(arrayBuffer), // 🔥 Correct way to upload a File
      ContentType: file.type, // Preserve file MIME type
    };

    await s3.send(new PutObjectCommand(params));

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${file_key}`;
}
