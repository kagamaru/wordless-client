import { Alert } from "antd";
import { ErrorCode } from "@/@types";

type Props = {
    error: {
        errorCode: ErrorCode | undefined;
        errorMessage: string;
    };
};

export function DisplayErrorMessage({ error }: Props) {
    if (!error.errorCode) {
        return;
    }

    return (
        <>
            <Alert
                message={`Error : ${error.errorCode}`}
                description={error.errorMessage}
                type="error"
                showIcon
                className="m-5"
            />
        </>
    );
}
