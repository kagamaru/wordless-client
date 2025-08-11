import { http, HttpResponse } from "msw";

export const userImageHandlers = [
    http.post("http://localhost:3000/api/userImage/:userId", () => {
        return HttpResponse.json({});
    })
];
