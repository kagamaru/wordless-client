"use client";

import { Button, ConfigProvider } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export function RedirectLoginButton() {
    const router = useRouter();

    const redirectLogin = () => {
        localStorage.removeItem("IdToken");
        router.push("/auth/login");
    };

    return (
        <div className="mt-6 text-center">
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button
                    color="primary"
                    type="primary"
                    icon={<LogoutOutlined />}
                    onClick={redirectLogin}
                    variant="outlined"
                >
                    ログイン画面に戻る
                </Button>
            </ConfigProvider>
        </div>
    );
}
