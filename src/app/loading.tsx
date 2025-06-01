"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { css } from "ss/css";

export default function Loading() {
    const pageLoadingStyle = css({
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    });

    return (
        <div className={pageLoadingStyle}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 160 }} spin />} />
        </div>
    );
}
