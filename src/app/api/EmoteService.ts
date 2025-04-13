import { FetchEmotesResponse } from "@/class";
import { fetchWithTimeout } from "./restApiUtility/restApiRequest";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";
const defaultAcquisitions = "10";

export class EmoteService {
    public fetchEmotes = async (userId: string, token: string): Promise<FetchEmotesResponse> => {
        try {
            const params = new URLSearchParams({
                userId,
                numberOfCompletedAcquisitionsCompleted: defaultAcquisitions
            });
            const response = await fetchWithTimeout<FetchEmotesResponse>(restApiUrl + `emotes/?${params}`, {
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
