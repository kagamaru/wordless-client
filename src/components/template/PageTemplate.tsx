"use client";

import { PageHeader } from "@/components/molecules";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

export function PageTemplate({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isMobile = useIsMobile();
    const pageTemplateStyle = css({
        paddingLeft: isMobile ? "16px" : "140px",
        paddingRight: isMobile ? "16px" : "140px"
    });

    return (
        <>
            <PageHeader></PageHeader>
            <div className={pageTemplateStyle}>{children}</div>
        </>
    );
}
