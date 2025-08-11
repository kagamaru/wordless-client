import { NextRequest, NextResponse } from "next/server";
import { handleAPIError, postWithTimeout } from "@/helpers";
import { BLACKLISTED } from "@/static/blackListIds";

const restApiUrl = process.env.REST_API_URL ?? "";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");

    if (!userId || !token) {
        return NextResponse.json({ data: "IMG-91" }, { status: 400 });
    }
    if (BLACKLISTED.has(userId)) {
        return NextResponse.json({ data: "IMG-92" }, { status: 400 });
    }

    try {
        const form = await req.formData();
        const file = form.get("file") as File | null;
        if (!file) {
            return NextResponse.json({ data: "IMG-93" }, { status: 400 });
        }

        // NOTE: ファイル情報（Content-Type/サイズ）
        const contentType = file.type || "application/octet-stream";
        const contentLength = file.size;

        // NOTE: 署名URLをREST APIに発行してもらう
        type IssueUploadUrlResponse = {
            putUrl: string;
            publicUrl: string;
        };
        const issue = await postWithTimeout<IssueUploadUrlResponse>(
            `${restApiUrl}userImage/${userId}/uploadUrl`,
            { contentType, contentLength },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const { putUrl } = issue.data;

        // NOTE: 取得した署名URLにNext.jsサーバからPUT
        const arrayBuffer = await file.arrayBuffer();
        const putRes = await fetch(putUrl, {
            method: "PUT",
            headers: {
                "Content-Type": contentType,
                "Content-Length": String(contentLength)
            },
            body: Buffer.from(arrayBuffer)
        });

        if (!putRes.ok) {
            return NextResponse.json({ data: "IMG-94" }, { status: 502 });
        }

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return handleAPIError(error);
    }
}
