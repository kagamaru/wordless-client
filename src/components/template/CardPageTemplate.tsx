"use client";

import { Card } from "antd";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

export function CardPageTemplate({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isMobile = useIsMobile();

    const cardPageStyle = css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "loginPageBackground"
    });

    const cardPageBlockStyle = css({
        width: isMobile ? "100%" : "500px",
        textAlign: "center"
    });

    const wordlessTitleStyle = css({
        color: "primary",
        fontSize: "48px",
        fontWeight: "bold"
    });

    const wordlessSubTitleStyle = css({
        marginBottom: "8px",
        fontSize: "16px",
        color: "grey"
    });

    const cardStyle = css({
        width: isMobile ? "99%" : 500,
        margin: "auto",
        marginTop: 50
    });

    return (
        <div className={cardPageStyle}>
            <div className={cardPageBlockStyle}>
                <div className={wordlessTitleStyle}>Wordless</div>
                <div className={wordlessSubTitleStyle}>- 絵文字でつながるSNS -</div>
                <Card className={cardStyle}>{children}</Card>
            </div>
        </div>
    );
}
