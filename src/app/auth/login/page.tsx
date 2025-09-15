"use client";

import { Tabs } from "antd";
import { useState } from "react";
import { CardPageTemplate } from "@/components/template";
import { LoginTab, SignupTab } from "@/components/molecules";

export default function LoginSignup() {
    const [activeTab, setActiveTab] = useState("login");

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

    return (
        <CardPageTemplate>
            <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} centered></Tabs>
        </CardPageTemplate>
    );
}
