import { restApiRequest } from "./restApiUtility/restApiRequest";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";

export class AuthService {
    public signin = async (credentials: { email: string; password: string }): Promise<void> => {
        try {
            await restApiRequest(
                restApiUrl + "login/",
                "POST",
                {
                    ...credentials
                },
                {
                    headers: {
                        credentials: "include"
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    };
}
