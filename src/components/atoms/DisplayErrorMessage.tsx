import { Alert } from "antd";
import { ErrorCode } from "@/@types";
import { css } from "ss/css";

type Props = {
    error: {
        errorCode: ErrorCode | undefined;
        errorMessage: string;
    };
    alignLeft?: boolean;
};

export function DisplayErrorMessage({ error, alignLeft = false }: Props) {
    if (!error.errorCode) {
        return;
    }

    const className = css({
        textAlign: "left"
    });

    return (
        <>
            <Alert
                message={`Error : ${error.errorCode}`}
                description={error.errorMessage}
                type="error"
                showIcon
                className={`m-5 ${alignLeft ? className : ""}`}
            />
        </>
    );
}
