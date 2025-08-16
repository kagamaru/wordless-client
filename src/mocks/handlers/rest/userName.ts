import { http, HttpResponse } from "msw";

export const userNameHandlers = [
    http.post("http://localhost:3000/api/userName/:userId", () => {
        return HttpResponse.json({});
    })
];
