import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import os from "os"; // Import os module

const streamPipeline = promisify(pipeline);

export async function downloadFromS3(file_key: string): Promise<string> {
  try {
    const s3 = new S3({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!, // Remove NEXT_PUBLIC_
        secretAccessKey: process.env.NEXT_PUBLIC_3_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const obj = await s3.getObject(params);

    if (!obj.Body) {
      throw new Error("File not found in S3.");
    }

    // Use os.tmpdir() for cross-platform compatibility
    const tempDir = os.tmpdir();
    const file_name = `${tempDir}/elliott${Date.now()}.pdf`.replace(/\\/g, "/"); // Ensure correct path format

    const fileStream = fs.createWriteStream(file_name);

    // Convert AWS ReadableStream to Node.js ReadableStream
    await streamPipeline(obj.Body as any, fileStream);

    return file_name;
  } catch (error) {
    console.error("Error downloading from S3:", error);
    throw error;
  }
}
