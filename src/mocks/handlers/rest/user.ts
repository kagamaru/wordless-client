import { http, HttpResponse } from "msw";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";

export const userHandlers = [
    http.get(restApiUrl + "users/:userId", () => {
        return HttpResponse.json({
            userId: "@fuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafu",
            userName: "Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga",
            userAvatarUrl: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        });
    })
];
