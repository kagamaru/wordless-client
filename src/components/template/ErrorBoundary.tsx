"use client";

import { Row } from "antd";
import React from "react";
import { ErrorCode } from "@/@types";
import { DisplayErrorMessage, RedirectLoginButton } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { getErrorMessage } from "@/helpers";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
    error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    override render() {
        const rawMessage = this.state.error?.message ?? "";
        // NOTE: エラーコードが含まれている場合はそのエラーコードを使用し、含まれていない場合はERR-01を使用する
        const errorCode = /^[A-Z]{3}/.test(rawMessage) ? (rawMessage as ErrorCode) : "ERR-01";
        const errorMessage = getErrorMessage(errorCode);

        if (errorCode.includes("AUN")) {
            window.location.href = "/auth/login";
        }

        if (this.state.hasError) {
            return (
                <div>
                    <PageHeader />
                    <Row justify="center" align="middle" className="text-3xl mt-5">
                        <div>😢</div>
                        <div className="m-5">エラーが発生しました</div>
                    </Row>
                    <DisplayErrorMessage error={{ errorCode, errorMessage }} />
                    <Row justify="center">
                        <RedirectLoginButton />
                    </Row>
                </div>
            );
        }

        return this.props.children;
    }
}
