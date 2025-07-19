"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useContext, useState } from "react";
import { css } from "ss/css";
import { MenuDrawer } from "@/components/molecules";
import { UserInfoContext } from "@/components/template";

export function PageHeader() {
    const [open, setOpen] = useState(false);
    const userInfo = useContext(UserInfoContext)?.userInfo;

    if (!userInfo) {
        return null;
    }

    const pageHeaderStyle = css({
        padding: "16px",
        color: "white",
        background: "primary"
    });

    const wordlessTitleTextStyle = css({
        fontSize: "24px !important",
        fontWeight: "bold"
    });

    const menuIconStyle = css({
        cursor: "pointer"
    });

    const openMenu = () => {
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <>
            <Row className={pageHeaderStyle}>
                <Col className={wordlessTitleTextStyle} span={2}>
                    <MenuOutlined className={menuIconStyle} onClick={openMenu} />
                </Col>
                <Col className={wordlessTitleTextStyle} span={22}>
                    <span className="ml-4">Wordless</span>
                </Col>
            </Row>
            <MenuDrawer open={open} onClose={closeMenu} user={userInfo} />
        </>
    );
}
