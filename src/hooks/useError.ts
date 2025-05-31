import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorCode } from "@/@types";
import { errorMessages } from "@/static/ErrorMessages";

export const useError = () => {
    const router = useRouter();
    const [hasError, setHasError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [handledError, setHandledError] = useState<{
        errorCode: ErrorCode | undefined;
        errorMessage: string;
    }>({
        errorCode: undefined,
        errorMessage: ""
    });

    const handleErrors = (error: Error | DOMException | unknown): void => {
        let errorCode: ErrorCode;

        if (error instanceof Error && error.message === "Unauthorized") {
            setAuthError(true);
            return;
        }
        if (error instanceof DOMException && error.name === "AbortError") {
            errorCode = "ABT-01";
        } else if (error instanceof Error && error.message === "Failed to fetch") {
            return;
        } else if (error instanceof Error) {
            errorCode = JSON.parse(error.message)?.error ?? "ERR-01";
        } else {
            errorCode = "ERR-01";
        }

        setHasError(true);
        setHandledError({ errorCode, errorMessage: getErrorMessage(errorCode) });
    };

    const getErrorMessage = (errorCode: ErrorCode): string => {
        if (errorCode in errorMessages) {
            return errorMessages[errorCode];
        } else {
            return "エラーが発生しています。しばらくの間使用できない可能性があります。";
        }
    };

    useEffect(() => {
        if (authError) {
            localStorage.removeItem("IdToken");
            router.push("/auth/login");
        }
    }, [authError]);

    return {
        hasError,
        handledError,
        handleErrors,
        getErrorMessage
    };
};
