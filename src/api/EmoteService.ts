import { FetchEmotesResponse } from "@/class";
import { restApiRequest } from "./restApiUtility/restApiRequest";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";
const defaultAcquisitions = "10";

export class EmoteService {
    public fetchEmotes = async (userId: string): Promise<FetchEmotesResponse> => {
        try {
            const params = new URLSearchParams({
                userId,
                numberOfCompletedAcquisitionsCompleted: defaultAcquisitions
            });
            const response = await restApiRequest<FetchEmotesResponse>(
                restApiUrl + `emotes/?${params}`,
                "GET",
                undefined,
                {
                    headers: {
                        credentials: "include"
                    }
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    };
}
