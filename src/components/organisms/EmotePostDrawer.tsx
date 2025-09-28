"use client";

import { Col, Drawer, Row } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { EmojiString, EmojiTab, UserSukiEmojis } from "@/@types";
import { Emoji as EmojiInterface } from "@/@types/Emoji";
import { EmojiSearchTextBox, SendEmoteButton } from "@/components/atoms";
import { PostEmoteEmojiSelectTabs, TypingEmote } from "@/components/molecules";
import { WebSocketContext, UserInfoContext } from "@/components/template";
import { emojiSearch } from "@/helpers";
import { useIsMobile } from "@/hooks";
import { presetEmojiMap, customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { css } from "ss/css";

type Props = {
    isOpen: boolean;
    onCloseAction: () => void;
};

export function EmotePostDrawer({ isOpen, onCloseAction }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<EmojiTab>("preset");
    const [userSukiEmojis, setUserSukiEmojis] = useState<UserSukiEmojis>([undefined, undefined, undefined, undefined]);
    const [searchedPresetEmojis, setSearchedPresetEmojis] = useState<Array<EmojiInterface>>(presetEmojiMap);
    const [searchedCustomEmojis, setSearchedCustomEmojis] = useState<Array<EmojiInterface>>(customEmojiMap);
    const [searchedMemeEmojis, setSearchedMemeEmojis] = useState<Array<EmojiInterface>>(memeEmojiMap);

    const userInfo = useContext(UserInfoContext)?.userInfo;
    const webSocketService = useContext(WebSocketContext);
    const isMobile = useIsMobile();
    const router = useRouter();
    const hasPostEmojis = userSukiEmojis.some((emoji) => emoji !== undefined);

    const onEmojiClick = (emojiId: EmojiString) => {
        const pushedEmoji = emojiId ?? undefined;
        if (!pushedEmoji) return;

        setUserSukiEmojis((prev) => {
            const firstUndefinedIndex = prev.findIndex((emojiId) => !emojiId);
            let newEmojis: UserSukiEmojis = [undefined, undefined, undefined, undefined];

            if (firstUndefinedIndex !== -1) {
                // NOTE: MAX(4つ)入力されていない時
                // NOTE: 空き(undefined)があれば、その位置に入れる
                newEmojis = prev.map((emojiId, index) => {
                    if (index === firstUndefinedIndex) {
                        return pushedEmoji;
                    }
                    return emojiId;
                }) as UserSukiEmojis;
            } else {
                // NOTE: MAX(4つ)入力されている時
                // NOTE: 空きがないため、最初の要素を削除し、新しい絵文字を末尾に入れる
                newEmojis = [...prev.slice(1), pushedEmoji] as UserSukiEmojis;
            }
            return newEmojis;
        });
    };

    const onEmojiDeleteClick = useCallback((index: number) => {
        setUserSukiEmojis((prev) => {
            const newEmojis: UserSukiEmojis = [...prev];
            newEmojis[index] = undefined;
            const filteredEmojis: Array<EmojiString | undefined> = newEmojis.filter((emojiId) => emojiId !== undefined);
            while (filteredEmojis.length < 4) {
                filteredEmojis.push(undefined);
            }
            return filteredEmojis as UserSukiEmojis;
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

    const onSendClick = () => {
        if (!hasPostEmojis || !userInfo || !userSukiEmojis[0]) {
            return;
        }

        webSocketService?.onPostEmote({
            userId: userInfo.userId,
            emoteEmoji1: userSukiEmojis[0],
            emoteEmoji2: userSukiEmojis[1],
            emoteEmoji3: userSukiEmojis[2],
            emoteEmoji4: userSukiEmojis[3],
            Authorization: localStorage.getItem("IdToken") ?? ""
        });
        onCloseAction();
        router.push("/");
    };

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
        <Drawer open={isOpen} closable={true} onClose={onCloseAction} placement="bottom" width={500} height="100%">
            <div className={emojiDialogStyle}>
                <div className={emojiPostDrawerTitleStyle}>今の気持ちを表そう</div>
                <Row justify="space-between" align="middle" className="mb-4">
                    <Col span={isMobile ? 21 : 22}>
                        <Row align="middle" style={{ fontSize: isMobile ? "28px" : "56px" }} role="listbox">
                            <TypingEmote userSukiEmojis={userSukiEmojis} onEmojiDeleteClick={onEmojiDeleteClick} />
                        </Row>
                    </Col>
                    <Col span={isMobile ? 3 : 2}>
                        <SendEmoteButton disabled={!hasPostEmojis} onSendClick={onSendClick} />
                    </Col>
                </Row>
                <div style={{ marginTop: 4, marginBottom: 4 }}>
                    <EmojiSearchTextBox searchTerm={searchTerm} onEmojiSearch={onEmojiSearch} />
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
