"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { css } from "ss/css";

export function PageHeader() {
    const pageHeader = css({
        padding: "16px",
        color: "white",
        background: "#7829cc",
        fontSize: "24px",
        fontWeight: "bold"
    });

    return (
        <>
            <Row className={pageHeader}>
                <Col span={2}>
                    <MenuOutlined />
                </Col>
                <Col span={22}>
                    <span className="ml-4">Wordless</span>
                </Col>
            </Row>
        </>
    );
}
