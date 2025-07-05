import Image from "next/image";
import { memo } from "react";
import { EmojiString } from "@/@types";
import { EmojiCategory } from "@/@types/Emoji";
import { emojiHelper } from "@/helpers";
import { css } from "ss/css";
import { CloseOutlined } from "@ant-design/icons";
import { useIsMobile } from "@/hooks";

type Props = {
    emojiId: EmojiString;
    size: number;
    onDeleteClick: () => void;
};

const EmojiComponent = ({ emojiId, size, onDeleteClick }: Props) => {
    const isMobile = useIsMobile();
    const returnedEmoji = emojiId ? emojiHelper(emojiId) : undefined;
    if (!returnedEmoji) return null;

    const presetEmojiStyle = css({
        fontSize: `${size.toString()}px !important`
    });

    const emojiDeleteOutlinedStyle = css({
        position: "absolute",
        top: "-8px",
        fontSize: "12px",
        backgroundColor: "white"
    });

    const imageEmojiDeleteOutlinedStyle = css({
        display: "block !important",
        position: "absolute",
        top: "-8px",
        marginLeft: isMobile ? "36px" : "72px",
        fontSize: "12px",
        backgroundColor: "white"
    });

    if (returnedEmoji.emojiCategory === EmojiCategory.Preset) {
        return (
            <div className={presetEmojiStyle} title={returnedEmoji.emojiJapaneseId}>
                {returnedEmoji.emojiChar}
                <CloseOutlined
                    role="button"
                    aria-label={returnedEmoji.emojiId + "delete-button"}
                    onClick={onDeleteClick}
                    className={emojiDeleteOutlinedStyle}
                />
            </div>
        );
    } else {
        const imageAlt = returnedEmoji.emojiJapaneseId || "No image available";

        return (
            <div>
                <Image
                    src={returnedEmoji.url ?? ""}
                    title={returnedEmoji.emojiJapaneseId}
                    alt={imageAlt}
                    width={size}
                    height={size}
                    unoptimized={returnedEmoji.url?.includes(".gif") ?? false}
                />
                <CloseOutlined
                    role="button"
                    aria-label={returnedEmoji.emojiId + "delete-button"}
                    onClick={onDeleteClick}
                    className={imageEmojiDeleteOutlinedStyle}
                />
            </div>
        );
    }
};

export const EmojiWithDeleteButton = memo(EmojiComponent);
