import { User } from "@/@types";
import { fetchWithTimeout } from "./restApiUtility/restApiRequest";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";

export class UserService {
    public findUser = async (userId: string, token: string): Promise<User> => {
        try {
            const response = await fetchWithTimeout<User>(restApiUrl + "users/" + userId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            return response;
        } catch (error) {
            throw error;
        }
    };
}
