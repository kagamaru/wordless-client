"use client";

import { Col, Row } from "antd";
import { css } from "ss/css";

export function PageHeaderWithoutMenu() {
    const pageHeaderStyle = css({
        padding: "16px",
        color: "white",
        background: "primary"
    });

    const wordlessTitleTextStyle = css({
        fontSize: "24px !important",
        fontWeight: "bold"
    });

    return (
        <>
            <Row className={pageHeaderStyle}>
                <Col className={wordlessTitleTextStyle} span={2}></Col>
                <Col className={wordlessTitleTextStyle} span={22}>
                    <span className="ml-4">Wordless</span>
                </Col>
            </Row>
        </>
    );
}
