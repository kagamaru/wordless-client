import { Alert } from "antd";

type Props = {
    errorMessage: string;
};

export function DisplayErrorMessageWithoutErrorCode({ errorMessage }: Props) {
    if (!errorMessage) {
        return;
    }

    return (
        <>
            <Alert description={errorMessage} type="error" showIcon className="mb-5" />
        </>
    );
}
