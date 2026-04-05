import { NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// Initialize S3 Client for Supabase
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for Supabase S3
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${userId}/${Date.now()}.webm`;

    // Perform S3 Multipart Upload
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: "sos-vault", // Your bucket name
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      },
    });

    await parallelUploads3.done();

    // Construct the public URL
    // Format: [Project-URL]/storage/v1/object/public/[Bucket]/[Path]
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sos-vault/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      path: fileName 
    });

  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}