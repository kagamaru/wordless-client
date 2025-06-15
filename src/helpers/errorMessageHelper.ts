import { ErrorCode } from "@/@types";
import { errorMessages } from "@/static/ErrorMessages";

export const getErrorMessage = (errorCode: ErrorCode): string => {
    if (errorCode in errorMessages) {
        return errorMessages[errorCode];
    } else {
        return "エラーが発生しています。しばらくの間使用できない可能性があります。";
    }
};
