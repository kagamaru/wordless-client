"use client";

import { Row } from "antd";
import { RedirectLoginButton } from "@/components/atoms";
import { PageHeaderWithoutMenu } from "@/components/molecules";

export default function DeleteUserCompletion() {
    return (
        <div>
            <PageHeaderWithoutMenu />
            <Row justify="center" align="middle" className="text-3xl mt-5">
                <div>🎉</div>
                <div className="m-5">アカウントが削除されました。ログイン画面に戻ってください。</div>
            </Row>
            <Row justify="center">
                <RedirectLoginButton />
            </Row>
        </div>
    );
}
