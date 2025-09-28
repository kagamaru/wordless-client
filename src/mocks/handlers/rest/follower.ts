import { PostFollowRequest } from "@/@types";
import { http, HttpResponse } from "msw";

export const followerHandlers = [
    http.get("http://localhost:3000/api/follow/:userId", () => {
        return HttpResponse.json({
            totalNumberOfFollowing: 10,
            followingUserIds: ["@hoge", "@fuga", "@piyo"],
            totalNumberOfFollowees: 10,
            followeeUserIds: ["@hoge", "@fuga", "@piyo"]
        });
    }),
    http.post("http://localhost:3000/api/follow/:userId", async ({ request }) => {
        try {
            const body = (await request.json()) as PostFollowRequest;
            if (!body.followerId) {
                return HttpResponse.json({ error: "followerId is required" }, { status: 400 });
            }

            return HttpResponse.json({
                totalNumberOfFollowing: 10,
                followingUserIds: ["@hoge", "@fuga", "@piyo"],
                totalNumberOfFollowees: 11,
                followeeUserIds: ["@hoge", "@fuga", "@piyo", body.followerId]
            });
        } catch (error) {
            return HttpResponse.json({ error: "Invalid request" }, { status: 400 });
        }
    })
];
