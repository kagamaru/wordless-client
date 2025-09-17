"use client";

import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { CardPageTemplate } from "@/components/template";
import { LoginTab, SignupTab } from "@/components/molecules";
import { useAuthInfoStore } from "@/store";

export default function LoginSignup() {
    const [activeTab, setActiveTab] = useState("login");
    const resetAuthInfo = useAuthInfoStore((state) => state.resetAuthInfo);

    const tabItems = [
        {
            key: "login",
            label: "ログイン",
            children: <LoginTab />
        },
        {
            key: "signup",
            label: "ユーザー登録",
            children: <SignupTab />
        }
    ];

    useEffect(() => {
        resetAuthInfo();
    }, []);

    return (
        <CardPageTemplate>
            <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} centered></Tabs>
        </CardPageTemplate>
    );
}
