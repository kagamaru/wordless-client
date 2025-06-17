import React from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

type Props = {
    onClick: () => void;
};

export const FixedFloatingButton: React.FC<Props> = ({ onClick }) => {
    const isMobile = useIsMobile();

    const wrapperStyle = css({
        position: "fixed",
        bottom: isMobile ? 10 : 20,
        right: isMobile ? 6 : 40,
        zIndex: 2
    });

    const speechButtonStyle = css({
        position: "relative",
        bg: "lightPrimary",
        color: "primary",
        px: isMobile ? "2" : "4",
        py: isMobile ? "1" : "3",
        w: isMobile ? "60px" : "92px",
        h: isMobile ? "60px" : "92px",
        borderRadius: "full",
        cursor: "pointer",
        _after: {
            content: "''",
            position: "absolute",
            bottom: isMobile ? -2 : -3,
            right: -1,
            width: isMobile ? "15px" : "30px",
            height: isMobile ? "20px" : "38px",
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            rotate: "135deg",
            bg: "lightPrimary"
        }
    });

    const imageSize = isMobile ? 44 : 80;

    const imageStyle = css({
        marginTop: isMobile ? "2px" : "1px"
    });

    return (
        <div className={wrapperStyle} role="button" aria-label="エモート投稿ボタン" onClick={onClick}>
            <div className={speechButtonStyle}>
                <Image
                    src="/wordlessIcon.png"
                    alt="emoji"
                    width={imageSize}
                    height={imageSize}
                    className={imageStyle}
                />
            </div>
        </div>
    );
};
