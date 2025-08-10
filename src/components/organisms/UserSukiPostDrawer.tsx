"use client";

import { Col, Drawer, Input, Row } from "antd";
import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { EmojiString, EmojiTab, PostUserSukiResponse } from "@/@types";
import { Emoji as EmojiInterface } from "@/@types/Emoji";
import { DisplayErrorMessage, EmojiWithDeleteButton } from "@/components/atoms";
import { PostEmoteEmojiSelectTabs } from "@/components/molecules";
import { UserInfoContext } from "@/components/template";
import { emojiHelper, emojiSearch, getHeader, postNextjsServer } from "@/helpers";
import { useError, useIsMobile, useParamUserId } from "@/hooks";
import { presetEmojiMap, customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { css } from "ss/css";
import { useMutation } from "@tanstack/react-query";

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

export function UserSukiPostDrawer({ isOpen, onCloseAction }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<EmojiTab>("preset");
    const [postEmojis, setPostEmojis] = useState<PostEmojis>([undefined, undefined, undefined, undefined]);
    const [searchedPresetEmojis, setSearchedPresetEmojis] = useState<Array<EmojiInterface>>(presetEmojiMap);
    const [searchedCustomEmojis, setSearchedCustomEmojis] = useState<Array<EmojiInterface>>(customEmojiMap);
    const [searchedMemeEmojis, setSearchedMemeEmojis] = useState<Array<EmojiInterface>>(memeEmojiMap);
    const formattedUserId = useParamUserId();
    const { handledError, handleErrors, hasError } = useError();

    const userInfo = useContext(UserInfoContext)?.userInfo;
    const isMobile = useIsMobile();
    const router = useRouter();

    const {
        mutateAsync: postUserSuki,
        isPending: isPostUserSukiPending,
        isError: isPostUserSukiError,
        error: postUserSukiError
    } = useMutation({
        mutationFn: async () => {
            await postNextjsServer<PostUserSukiResponse>(
                `/api/userSuki/${formattedUserId}`,
                {
                    userSukiEmoji1: postEmojis[0]?.emojiId,
                    userSukiEmoji2: postEmojis[1]?.emojiId,
                    userSukiEmoji3: postEmojis[2]?.emojiId,
                    userSukiEmoji4: postEmojis[3]?.emojiId
                },
                getHeader()
            );
        }
    });

    const onEmojiClick = (emojiId: EmojiString) => {
        const pushedEmoji = emojiId ? emojiHelper(emojiId) : undefined;
        if (!pushedEmoji) return;

        setPostEmojis((prev) => {
            const firstUndefinedIndex = prev.findIndex((emoji) => emoji === undefined);
            let newEmojis: PostEmojis = [undefined, undefined, undefined, undefined];

            if (firstUndefinedIndex !== -1) {
                // NOTE: MAX(4つ)入力されていない時
                // NOTE: 空き(undefined)があれば、その位置に入れる
                newEmojis = prev.map((emoji, index) => {
                    if (index === firstUndefinedIndex) {
                        return pushedEmoji;
                    }
                    return emoji;
                }) as PostEmojis;
            } else {
                // NOTE: MAX(4つ)入力されている時
                // NOTE: 空きがないため、最初の要素を削除し、新しい絵文字を末尾に入れる
                newEmojis = [...prev.slice(1), pushedEmoji] as PostEmojis;
            }
            return newEmojis;
        });
    };

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
        cursor: "pointer",
        opacity: 1
    });

    const loadingOutlinedStyle = css({
        fontSize: isMobile ? "32px" : "56px",
        color: "primary !important"
    });

    const onSendClick = async () => {
        if (!userInfo) {
            return;
        }

        try {
            await postUserSuki();
        } catch (error) {
            console.error(error);
            return;
        }

        onCloseAction();
        router.push(`/user/${userInfo.userId}`);
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

    useEffect(() => {
        if (isPostUserSukiError && postUserSukiError) {
            try {
                handleErrors(JSON.parse(postUserSukiError.message));
            } catch (error) {
                console.error("Error parsing error message:", error);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPostUserSukiError, postUserSukiError]);

    return (
        <Drawer open={isOpen} closable={true} onClose={onCloseAction} placement="bottom" width={500} height="100%">
            <div className={emojiDialogStyle}>
                {hasError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
                <div className={emojiPostDrawerTitleStyle}>あなたの「スキ」を登録しよう</div>
                <Row justify="space-between" align="middle" className="mb-4">
                    <Col span={isMobile ? 21 : 22}>
                        <Row align="middle" style={{ fontSize: isMobile ? "28px" : "56px" }} role="listbox">
                            {postEmojis.map((emoji, i) => (
                                <div key={i}>
                                    {emoji ? (
                                        <div
                                            className={displayEmojiBlockStyle}
                                            role="option"
                                            aria-selected={true}
                                            aria-label={"入力済絵文字" + (i + 1)}
                                        >
                                            <EmojiWithDeleteButton
                                                emojiId={emoji.emojiId}
                                                size={isMobile ? 40 : 80}
                                                onDeleteClick={() => onEmojiDeleteClick(i)}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={emojiBlankListItemStyle}
                                            role="option"
                                            aria-label={"未入力絵文字" + (i + 1)}
                                            aria-selected={false}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </Row>
                    </Col>
                    <Col span={isMobile ? 3 : 2}>
                        <div
                            role="button"
                            aria-label="ユーザースキ登録ボタン"
                            aria-disabled={isPostUserSukiPending}
                            onClick={onSendClick}
                        >
                            {isPostUserSukiPending ? (
                                <LoadingOutlined className={loadingOutlinedStyle} />
                            ) : (
                                <SendOutlined className={sendButtonStyle} />
                            )}
                        </div>
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
