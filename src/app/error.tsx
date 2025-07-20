"use client";

import { Row } from "antd";
import { DisplayErrorMessage, RedirectLoginButton } from "@/components/atoms";
import { PageHeaderWithoutMenu } from "@/components/molecules";
import { getErrorMessage } from "@/helpers";

export default function Error() {
    const unknownErrorCode = "ERR-01";

    return (
        <div>
            <PageHeaderWithoutMenu />
            <Row justify="center" align="middle" className="text-3xl mt-5">
                <div>😢</div>
                <div className="m-5">エラーが発生しました</div>
            </Row>
            <DisplayErrorMessage
                error={{ errorCode: unknownErrorCode, errorMessage: getErrorMessage(unknownErrorCode) }}
            />
            <Row justify="center">
                <RedirectLoginButton />
            </Row>
        </div>
    );
}
