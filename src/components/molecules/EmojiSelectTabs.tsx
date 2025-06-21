import { Tabs } from "antd";
import { EmojiString } from "@/@types";
import { Emoji as EmojiInterface } from "@/@types/Emoji";
import { EmojiButtonRow, ImageEmojiButtonRow } from "@/components/atoms";
import { PresetEmojis } from "@/components/molecules";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

type Props = {
    activeTab: "preset" | "custom" | "meme";
    isSearching: boolean;
    presetEmojis: Array<EmojiInterface>;
    customEmojis: Array<EmojiInterface>;
    memeEmojis: Array<EmojiInterface>;
    onEmojiClick: (emojiId: EmojiString) => void;
    onTabClick: (tab: "preset" | "custom" | "meme") => void;
};

export function EmojiSelectTabs({
    activeTab,
    isSearching,
    presetEmojis,
    customEmojis,
    memeEmojis,
    onEmojiClick,
    onTabClick
}: Props) {
    const isMobile = useIsMobile();

    const emojiDialogScrollBoxStyle = css({
        height: isMobile ? "300px" : "500px",
        overflowY: "auto",
        overflowX: "hidden"
    });

    const renderEmojiTab = (emojiMap: Array<EmojiInterface>) => (
        <div className={emojiDialogScrollBoxStyle}>
            <ImageEmojiButtonRow emojis={emojiMap} onClickAction={(emojiId) => onEmojiClick(emojiId)} />
        </div>
    );

    const presetTab = (
        <div className={emojiDialogScrollBoxStyle}>
            {isSearching ? (
                <EmojiButtonRow emojis={presetEmojis} onClickAction={(emojiId) => onEmojiClick(emojiId)} />
            ) : (
                <PresetEmojis onEmojiClick={(emojiId) => onEmojiClick(emojiId)} />
            )}
        </div>
    );

    const customTab = renderEmojiTab(customEmojis);
    const memeTab = renderEmojiTab(memeEmojis);

    const tabItems = [
        {
            key: "preset",
            label: "プリセット",
            children: presetTab
        },
        {
            key: "custom",
            label: "カスタム",
            children: customTab
        },
        {
            key: "meme",
            label: "ミーム",
            children: memeTab
        }
    ];

    return (
        <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={(key) => onTabClick(key as "preset" | "custom" | "meme")}
        ></Tabs>
    );
}
