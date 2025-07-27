import { http, HttpResponse } from "msw";

export const followerHandlers = [
    http.get("http://localhost:3000/api/follower/:userId", () => {
        return HttpResponse.json({
            totalNumberOfFollowing: 10,
            followingUserIds: ["@hoge", "@fuga", "@piyo"],
            totalNumberOfFollowees: 10,
            followeeUserIds: ["@hoge", "@fuga", "@piyo"]
        });
    })
];
