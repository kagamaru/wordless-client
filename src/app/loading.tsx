"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { css } from "ss/css";

export default function Loading() {
    const pageLoading = css({
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    });

    return (
        <div className={pageLoading}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 160 }} spin />} />
        </div>
    );
}
