"use client";

import { Col, Drawer, Input, Row } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { EmojiString, EmojiTab } from "@/@types";
import { Emoji as EmojiInterface } from "@/@types/Emoji";
import { EmojiWithDeleteButton } from "@/components/atoms";
import { PostEmoteEmojiSelectTabs } from "@/components/molecules";
import { emojiHelper, emojiSearch } from "@/helpers";
import { useIsMobile } from "@/hooks";
import { presetEmojiMap, customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { css } from "ss/css";

type Props = {
    isOpen: boolean;
    onCloseAction: () => void;
};

type PostEmojis = [
    EmojiInterface | undefined,
    EmojiInterface | undefined,
    EmojiInterface | undefined,
    EmojiInterface | undefined
];

export function EmotePostDrawer({ isOpen, onCloseAction }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<EmojiTab>("preset");
    const [postEmojis, setPostEmojis] = useState<PostEmojis>([undefined, undefined, undefined, undefined]);
    const [searchedPresetEmojis, setSearchedPresetEmojis] = useState<Array<EmojiInterface>>(presetEmojiMap);
    const [searchedCustomEmojis, setSearchedCustomEmojis] = useState<Array<EmojiInterface>>(customEmojiMap);
    const [searchedMemeEmojis, setSearchedMemeEmojis] = useState<Array<EmojiInterface>>(memeEmojiMap);
    const isMobile = useIsMobile();

    const onEmojiClick = useCallback((emojiId: EmojiString) => {
        const pushedEmoji = emojiHelper(emojiId);
        if (!pushedEmoji) {
            return;
        }
        setPostEmojis((prev) => {
            const newEmojis: PostEmojis = [...prev];
            const firstUndefinedIndex = newEmojis.findIndex((emoji) => emoji === undefined);
            if (firstUndefinedIndex !== -1) {
                newEmojis[firstUndefinedIndex] = pushedEmoji;
            } else {
                newEmojis.shift();
                newEmojis.push(pushedEmoji);
            }
            return newEmojis;
        });
    }, []);

    const onEmojiDeleteClick = useCallback((index: number) => {
        setPostEmojis((prev) => {
            const newEmojis: PostEmojis = [...prev];
            newEmojis[index] = undefined;
            const filteredEmojis: Array<EmojiInterface | undefined> = newEmojis.filter((emoji) => emoji !== undefined);
            while (filteredEmojis.length < 4) {
                filteredEmojis.push(undefined);
            }
            return filteredEmojis as PostEmojis;
        });
    }, []);

    const onEmojiSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);

        switch (activeTab) {
            case "preset":
                setSearchedPresetEmojis(emojiSearch(searchTerm, "preset"));
                break;
            case "custom":
                setSearchedCustomEmojis(emojiSearch(searchTerm, "custom"));
                break;
            case "meme":
                setSearchedMemeEmojis(emojiSearch(searchTerm, "meme"));
                break;
        }
    };

    const emojiDialogStyle = css({
        position: "relative",
        padding: "16px 24px 8px"
    });

    const emojiPostDrawerTitleStyle = css({
        fontSize: "20px",
        marginBottom: "24px",
        color: "grey"
    });

    const emojiBlankListItemStyle = css({
        width: isMobile ? "48px" : "80px",
        height: isMobile ? "48px" : "80px",
        marginRight: "8px",
        border: "2px dashed #888",
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    });

    const displayEmojiBlockStyle = css({
        marginRight: "8px",
        width: isMobile ? "48px" : "80px",
        height: isMobile ? "48px" : "80px",
        textAlign: "center"
    });

    const sendButtonStyle = css({
        fontSize: isMobile ? "32px" : "56px",
        color: "primary !important",
        cursor: "pointer"
    });

    useEffect(() => {
        if (isOpen) {
            setActiveTab("preset");
            setSearchTerm("");
        }
    }, [isOpen]);

    return (
        <Drawer open={isOpen} closable={true} onClose={onCloseAction} placement="bottom" width={500} height="100%">
            <div className={emojiDialogStyle}>
                <div className={emojiPostDrawerTitleStyle}>今の気持ちを表そう</div>
                <Row justify="space-between" align="middle" className="mb-4">
                    <Col span={isMobile ? 21 : 22}>
                        <Row align="middle" style={{ fontSize: isMobile ? "28px" : "56px" }} role="list">
                            {postEmojis.map((emoji, i) => (
                                <div key={i} role="listitem">
                                    {emoji ? (
                                        <div className={displayEmojiBlockStyle}>
                                            <EmojiWithDeleteButton
                                                emojiId={emoji.emojiId}
                                                size={isMobile ? 40 : 80}
                                                onDeleteClick={() => onEmojiDeleteClick(i)}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={emojiBlankListItemStyle}
                                            role="listitem"
                                            aria-label="絵文字入力エリア"
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </Row>
                    </Col>
                    <Col span={isMobile ? 3 : 2}>
                        <SendOutlined className={sendButtonStyle} role="button" aria-label="エモート送信ボタン" />
                    </Col>
                </Row>

                <div style={{ marginTop: 4, marginBottom: 4 }}>
                    <Input
                        placeholder="絵文字を検索..."
                        value={searchTerm}
                        onChange={(e) => onEmojiSearch(e.target.value)}
                        allowClear
                    />
                </div>
                <PostEmoteEmojiSelectTabs
                    activeTab={activeTab}
                    isSearching={!!searchTerm}
                    presetEmojis={searchedPresetEmojis}
                    customEmojis={searchedCustomEmojis}
                    memeEmojis={searchedMemeEmojis}
                    onEmojiClick={(emojiId) => onEmojiClick(emojiId)}
                    onTabClick={(tab) => setActiveTab(tab)}
                />
            </div>
        </Drawer>
    );
}
