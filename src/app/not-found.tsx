"use client";

import { Row } from "antd";
import { RedirectTopButton } from "@/components/atoms";
import { PageHeaderWithoutMenu } from "@/components/molecules";

export default function NotFound() {
    return (
        <div>
            <PageHeaderWithoutMenu />
            <Row justify="center" align="middle" className="text-3xl mt-5">
                <div>😶‍🌫️</div>
                <div className="m-5">ページが見つかりません。トップ画面から操作してください。</div>
            </Row>
            <Row justify="center">
                <RedirectTopButton />
            </Row>
        </div>
    );
}
