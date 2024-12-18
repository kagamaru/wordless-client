"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

export function PageHeader() {
    return (
        <>
            <Row>
                <Col span={2}>
                    <MenuOutlined />
                </Col>
                <Col span={22}>Wordless</Col>
            </Row>
        </>
    );
}
