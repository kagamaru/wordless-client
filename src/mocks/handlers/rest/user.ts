import { http, HttpResponse } from "msw";

const s3Url = process.env.NEXT_PUBLIC_S3_URL ?? "";

export const userHandlers = [
    http.get("http://localhost:3000/api/user/:userId", () => {
        return HttpResponse.json({
            userId: "@fuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafu",
            userName: "Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga",
            userAvatarUrl: s3Url + "/userProfile/fuga_fuga.png"
        });
    }),
    http.post("http://localhost:3000/api/user/:userId", (context) => {
        const { userId } = context.params;
        return HttpResponse.json({
            userId
        });
    })
];
