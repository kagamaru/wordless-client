import { Alert } from "antd";
import { memo } from "react";
import { ErrorCode } from "@/@types";

type Props = {
    error: {
        errorCode: ErrorCode | undefined;
        errorMessage: string;
    };
};

export function DisplayErrorMessage(props: Props) {
    if (!props.error.errorCode) {
        return;
    }

    return (
        <>
            <Alert
                message={`Error : ${props.error.errorCode}`}
                description={props.error.errorMessage}
                type="error"
                showIcon
                className="m-5"
            />
        </>
    );
}
