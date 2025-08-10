"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { MenuDrawer } from "@/components/molecules";
import { UserInfoContext } from "@/components/template";
import { css } from "ss/css";

export function PageHeader() {
    const [open, setOpen] = useState(false);

    const router = useRouter();
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
        fontWeight: "bold",
        cursor: "pointer"
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

    const onWordlessTitleClick = () => {
        router.push("/");
    };

    return (
        <>
            <Row className={pageHeaderStyle}>
                <Col className={wordlessTitleTextStyle} span={2}>
                    <MenuOutlined className={menuIconStyle} onClick={openMenu} />
                </Col>
                <Col span={22}>
                    <span
                        className={wordlessTitleTextStyle + " " + "ml-4"}
                        role="heading"
                        aria-level={1}
                        onClick={onWordlessTitleClick}
                    >
                        Wordless
                    </span>
                </Col>
            </Row>
            <MenuDrawer open={open} onClose={closeMenu} user={userInfo} />
        </>
    );
}
