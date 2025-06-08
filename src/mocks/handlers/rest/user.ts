import { http, HttpResponse } from "msw";

export const userHandlers = [
    http.get("http://localhost:3000/api/user/:userId", () => {
        return HttpResponse.json({
            userId: "@fuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafuga_fugafu",
            userName: "Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga Fuga",
            userAvatarUrl: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        });
    })
];
