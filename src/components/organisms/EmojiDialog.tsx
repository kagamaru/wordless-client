"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Input, Modal } from "antd";
import { CloseButton } from "@/components/atoms";
import { EmojiSelectTabs } from "@/components/molecules";
import { UserInfoContext, WebSocketContext } from "@/components/template";
import { presetEmojiMap, customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { Emoji as EmojiInterface } from "@/@types/Emoji";
import { EmojiString, EmojiTab } from "@/@types";
import { emojiSearch } from "@/helpers";
import { css } from "ss/css";

type Props = {
    emoteReactionId: string;
    isOpen: boolean;
    alreadyReactedEmojiIds: Array<EmojiString>;
    closeDialogAction: () => void;
};

export function EmojiDialog({ emoteReactionId, isOpen, alreadyReactedEmojiIds, closeDialogAction }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<EmojiTab>("preset");
    const [searchedPresetEmojis, setSearchedPresetEmojis] = useState<Array<EmojiInterface>>(presetEmojiMap);
    const [searchedCustomEmojis, setSearchedCustomEmojis] = useState<Array<EmojiInterface>>(customEmojiMap);
    const [searchedMemeEmojis, setSearchedMemeEmojis] = useState<Array<EmojiInterface>>(memeEmojiMap);
    const webSocketService = useContext(WebSocketContext);
    const userInfo = useContext(UserInfoContext)?.userInfo;

    const onEmojiClick = useCallback(
        (reactedEmojiId: EmojiString) => {
            if (!userInfo) {
                return;
            }

            webSocketService?.onReact({
                emoteReactionId,
                reactedUserId: userInfo.userId,
                reactedEmojiId: reactedEmojiId,
                operation: alreadyReactedEmojiIds.includes(reactedEmojiId) ? "decrement" : "increment",
                Authorization: localStorage.getItem("IdToken") ?? ""
            });
            closeDialogAction();
        },
        [webSocketService, emoteReactionId, alreadyReactedEmojiIds, closeDialogAction, userInfo]
    );

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

    useEffect(() => {
        if (isOpen) {
            setActiveTab("preset");
            setSearchTerm("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        setSearchedPresetEmojis(emojiSearch(searchTerm, "preset"));
        setSearchedCustomEmojis(emojiSearch(searchTerm, "custom"));
        setSearchedMemeEmojis(emojiSearch(searchTerm, "meme"));
    }, [searchTerm]);

    return (
        <Modal
            open={isOpen}
            onCancel={closeDialogAction}
            footer={null}
            closable={false}
            centered
            maskClosable
            width={500}
        >
            <div className={emojiDialogStyle}>
                <CloseButton onClickAction={closeDialogAction} />
                <div style={{ marginTop: 4, marginBottom: 4 }}>
                    <Input
                        placeholder="絵文字を検索..."
                        value={searchTerm}
                        onChange={(e) => onEmojiSearch(e.target.value)}
                        allowClear
                    />
                </div>
                <EmojiSelectTabs
                    activeTab={activeTab}
                    isSearching={!!searchTerm}
                    presetEmojis={searchedPresetEmojis}
                    customEmojis={searchedCustomEmojis}
                    memeEmojis={searchedMemeEmojis}
                    onEmojiClick={(emojiId) => onEmojiClick(emojiId)}
                    onTabClick={(tab) => setActiveTab(tab)}
                />
            </div>
        </Modal>
    );
}
