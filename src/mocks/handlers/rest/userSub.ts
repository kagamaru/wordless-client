import { http, HttpResponse } from "msw";
import envConfigMap from "envConfig";

const s3Url = envConfigMap.get("NEXT_PUBLIC_S3_URL");

export const userSubHandlers = [
    http.get("http://localhost:3000/api/userSub/:userSub", () => {
        return HttpResponse.json({
            userId: "@fuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafu",
            userName: "Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga",
            userAvatarUrl: s3Url + "/userProfile/fuga_fuga.png"
        });
    })
];
