import { http, HttpResponse } from "msw";

export const userSukiHandlers = [
    http.get("http://localhost:3000/api/userSuki/:userId", () => {
        return HttpResponse.json({
            userSuki: [":rat:", ":cow:", ":tiger:", ":rabbit:"]
        });
    }),
    http.post("http://localhost:3000/api/userSuki/:userId", () => {
        return HttpResponse.json({
            userId: "@fuga_fuga",
            userSuki: [":rat:", ":cow:", ":tiger:", ":rabbit:"]
        });
    })
];
