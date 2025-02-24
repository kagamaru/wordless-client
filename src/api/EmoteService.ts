import { FetchEmotesResponse } from "@/class";
import { restApiRequest } from "./restApiUtility/restApiRequest";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";

export class EmoteService {
    public fetchEmotes = async (userId: string): Promise<FetchEmotesResponse> => {
        try {
            const params = new URLSearchParams({
                userId,
                numberOfCompletedAcquisitionsCompleted: "10"
            });
            const response = await restApiRequest<FetchEmotesResponse>(restApiUrl + `emotes/?${params}`);
            return response;
        } catch (error) {
            throw error;
        }
    };
}
