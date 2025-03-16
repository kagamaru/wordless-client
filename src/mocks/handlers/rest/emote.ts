import { http, HttpResponse } from "msw";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";

export const emoteHandlers = [
    http.get(restApiUrl + "emotes/", () => {
        return HttpResponse.json(
            {
                error: "EMT-01"
            },
            {
                status: 400
            }
        );
    })
];
