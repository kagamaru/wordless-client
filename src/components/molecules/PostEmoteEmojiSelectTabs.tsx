import { Tabs } from "antd";
import { EmojiString, EmojiTab } from "@/@types";
import { Emoji as EmojiInterface } from "@/@types/Emoji";
import { EmotePostEmojiButtonRow, EmotePostImageEmojiButtonRow } from "@/components/atoms";
import { PresetEmojis } from "@/components/molecules";
import { css } from "ss/css";

type Props = {
    activeTab: EmojiTab;
    isSearching: boolean;
    presetEmojis: Array<EmojiInterface>;
    customEmojis: Array<EmojiInterface>;
    memeEmojis: Array<EmojiInterface>;
    onEmojiClick: (emojiId: EmojiString) => void;
    onTabClick: (tab: EmojiTab) => void;
};

export function PostEmoteEmojiSelectTabs({
    activeTab,
    isSearching,
    presetEmojis,
    customEmojis,
    memeEmojis,
    onEmojiClick,
    onTabClick
}: Props) {
    const emojiDialogScrollBoxStyle = css({
        overflowY: "auto",
        overflowX: "hidden"
    });

    const renderEmojiTab = (emojiMap: Array<EmojiInterface>) => (
        <div className={emojiDialogScrollBoxStyle}>
            <EmotePostImageEmojiButtonRow emojis={emojiMap} onClickAction={(emojiId) => onEmojiClick(emojiId)} />
        </div>
    );

    const presetTab = (
        <div className={emojiDialogScrollBoxStyle}>
            {isSearching ? (
                <EmotePostEmojiButtonRow emojis={presetEmojis} onClickAction={(emojiId) => onEmojiClick(emojiId)} />
            ) : (
                <PresetEmojis isEmotePost={true} onEmojiClick={(emojiId) => onEmojiClick(emojiId)} />
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

    return <Tabs activeKey={activeTab} items={tabItems} onChange={(key) => onTabClick(key as EmojiTab)}></Tabs>;
}
