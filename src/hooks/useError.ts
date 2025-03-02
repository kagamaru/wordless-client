import { ErrorCode } from "@/@types";
import { errorMessages } from "@/static/ErrorMessages";
import { useState } from "react";

export const useError = () => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<{
        errorCode: ErrorCode | undefined;
        errorMessage: string;
    }>({
        errorCode: undefined,
        errorMessage: ""
    });

    const handleErrors = (error: Error | DOMException | unknown): void => {
        let errorCode: ErrorCode;

        if (error instanceof DOMException && error.name === "AbortError") {
            errorCode = "ABT-01";
        } else if (error instanceof Error) {
            errorCode = JSON.parse(error.message)?.error ?? "ERR-01";
        } else {
            errorCode = "ERR-01";
        }

        setHasError(true);
        setError({ errorCode, errorMessage: getErrorMessage(errorCode) });
    };

    const getErrorMessage = (errorCode: ErrorCode): string => {
        if (errorCode in errorMessages) {
            return errorMessages[errorCode];
        } else {
            return "エラーが発生しています。しばらくの間使用できない可能性があります。";
        }
    };

    return {
        hasError,
        error,
        handleErrors,
        getErrorMessage
    };
};
