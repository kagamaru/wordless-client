import { Alert } from "antd";

type Props = {
    errorMessage: string;
};

export function DisplayErrorMessageWithoutErrorCode({ errorMessage }: Props) {
    return (
        <>
            <Alert description={errorMessage} type="error" showIcon className="mb-5" />
        </>
    );
}
