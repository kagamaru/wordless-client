import { useParams } from "next/navigation";

export const useParamUserId = () => {
    const { userId } = useParams();
    if (!userId || typeof userId !== "string") {
        throw new Error("userId is not a string");
    }
    // NOTE: ユーザーIDがURLに含まれる場合、@が%40に変換されるため、ここで変換する
    const formattedUserId = userId.replace("%40", "@");
    return formattedUserId;
};
