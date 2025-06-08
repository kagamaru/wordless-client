import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APIResponse, ErrorCode } from "@/@types";
import { errorMessages } from "@/static/ErrorMessages";

export const useError = () => {
    const router = useRouter();
    const [hasError, setHasError] = useState(false);
    const [hasAuthError, setHasAuthError] = useState(false);
    const [handledError, setHandledError] = useState<{
        errorCode: ErrorCode | undefined;
        errorMessage: string;
    }>({
        errorCode: undefined,
        errorMessage: ""
    });

    const handleErrors = (error: APIResponse<ErrorCode>): void => {
        let errorCode: ErrorCode;

        if (error.status === 401) {
            setHasAuthError(true);
            return;
        } else if (error.data) {
            errorCode = error.data;
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
        if (hasAuthError) {
            localStorage.removeItem("IdToken");
            router.push("/auth/login");
        }
    }, [hasAuthError]);

    return {
        hasAuthError,
        hasError,
        handledError,
        handleErrors,
        getErrorMessage
    };
};
