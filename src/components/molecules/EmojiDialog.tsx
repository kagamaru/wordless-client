"use client";

import React, { useContext, useState } from "react";
import { Input, Modal, Tabs } from "antd";
import { CloseButton, ImageEmojiButtonRow, EmojiButtonRow } from "@/components/atoms";
import { EmojiButtonBlocksByType } from "@/components/molecules";
import { WebSocketContext } from "@/components/template";
import { presetEmojiMap, customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { EmojiType, Emoji as EmojiInterface } from "@/@types/Emoji";
import { EmojiString } from "@/@types";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

type Props = {
    emoteReactionId: string;
    isOpen: boolean;
    alreadyReactedEmojiIds: Array<EmojiString>;
    closeDialogAction: () => void;
};

export function EmojiDialog({ emoteReactionId, isOpen, alreadyReactedEmojiIds, closeDialogAction }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("preset");
    const isMobile = useIsMobile();
    const webSocketService = useContext(WebSocketContext);

    const onEmojiClick = (emoteReactionId: string, reactedEmojiId: EmojiString) => {
        webSocketService?.onReact({
            emoteReactionId,
            reactedUserId: "@fuga_fuga",
            reactedEmojiId,
            operation: alreadyReactedEmojiIds.includes(reactedEmojiId) ? "decrement" : "increment",
            Authorization: localStorage.getItem("IdToken") ?? ""
        });
        closeDialogAction();
    };

    const presetEmojis = () => {
        const smileysEmotion: Array<EmojiInterface> = [];
        const peopleBody: Array<EmojiInterface> = [];
        const animalsNature: Array<EmojiInterface> = [];
        const foodDrink: Array<EmojiInterface> = [];
        const travelPlaces: Array<EmojiInterface> = [];
        const activities: Array<EmojiInterface> = [];
        const objects: Array<EmojiInterface> = [];
        const symbols: Array<EmojiInterface> = [];
        const flags: Array<EmojiInterface> = [];

        presetEmojiMap.map((emoji) => {
            switch (emoji.emojiType) {
                case EmojiType.SmileysEmotion:
                    smileysEmotion.push(emoji);
                    break;
                case EmojiType.PeopleBody:
                    peopleBody.push(emoji);
                    break;
                case EmojiType.AnimalsNature:
                    animalsNature.push(emoji);
                    break;
                case EmojiType.FoodDrink:
                    foodDrink.push(emoji);
                    break;
                case EmojiType.TravelPlaces:
                    travelPlaces.push(emoji);
                    break;
                case EmojiType.Activities:
                    activities.push(emoji);
                    break;
                case EmojiType.Objects:
                    objects.push(emoji);
                    break;
                case EmojiType.Symbols:
                    symbols.push(emoji);
                    break;
                case EmojiType.Flags:
                    flags.push(emoji);
                    break;
                default:
                    break;
            }
        });

        return (
            [
                [smileysEmotion, "笑顔と感情"],
                [peopleBody, "人と身体"],
                [animalsNature, "動物と自然"],
                [foodDrink, "食べ物と飲み物"],
                [travelPlaces, "旅行と場所"],
                [activities, "活動"],
                [objects, "オブジェクト"],
                [symbols, "記号"],
                [flags, "国旗"]
            ] as Array<[Array<EmojiInterface>, string]>
        ).map(([emojis, label]) => {
            return (
                <EmojiButtonBlocksByType
                    key={label}
                    typeName={label}
                    emojis={emojis}
                    onClickAction={(emojiId) => onEmojiClick(emoteReactionId, emojiId)}
                />
            );
        });
    };

    const onEmojiSearch = (searchTerm: string): EmojiInterface[] => {
        let searchResults: Array<EmojiInterface> = [];
        const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(searchTerm);

        switch (activeTab) {
            case "preset":
                searchResults = presetEmojiMap.filter((emoji) =>
                    isJapanese ? emoji.emojiJapaneseId?.includes(searchTerm) : emoji.emojiId.includes(searchTerm)
                );
                break;
            case "custom":
                searchResults = customEmojiMap.filter((emoji) =>
                    isJapanese ? emoji.emojiJapaneseId?.includes(searchTerm) : emoji.emojiId.includes(searchTerm)
                );
                break;
            case "meme":
                searchResults = memeEmojiMap.filter((emoji) =>
                    isJapanese ? emoji.emojiJapaneseId?.includes(searchTerm) : emoji.emojiId.includes(searchTerm)
                );
                break;
        }

        return searchResults;
    };

    const emojiDialogScrollBox = css({
        height: isMobile ? "300px" : "500px",
        overflowY: "auto",
        overflowX: "hidden"
    });

    const emojiDialog = css({
        position: "relative",
        padding: "16px 24px 8px"
    });

    const renderEmojiTab = (emojiMap: Array<EmojiInterface>) => (
        <div className={emojiDialogScrollBox}>
            <ImageEmojiButtonRow
                emojis={searchTerm ? onEmojiSearch(searchTerm) : emojiMap}
                onClickAction={(emojiId) => onEmojiClick(emoteReactionId, emojiId)}
            />
        </div>
    );

    // TODO: クリックイベント実装
    const presetTab = (
        <div className={emojiDialogScrollBox}>
            {searchTerm ? (
                <EmojiButtonRow
                    emojis={onEmojiSearch(searchTerm)}
                    onClickAction={(emojiId) => onEmojiClick(emoteReactionId, emojiId)}
                />
            ) : (
                presetEmojis()
            )}
        </div>
    );
    const customTab = renderEmojiTab(customEmojiMap);
    const memeTab = renderEmojiTab(memeEmojiMap);

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
        <Modal
            open={isOpen}
            onCancel={closeDialogAction}
            footer={null}
            closable={false}
            centered
            maskClosable
            width={500}
        >
            <div className={emojiDialog}>
                <CloseButton onClickAction={closeDialogAction} />
                <div style={{ marginTop: 4, marginBottom: 4 }}>
                    <Input
                        placeholder="絵文字を検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />
                </div>
                <Tabs defaultActiveKey={activeTab} items={tabItems} onChange={(key) => setActiveTab(key)}></Tabs>
            </div>
        </Modal>
    );
}
