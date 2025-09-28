"use client";

import { Col, Drawer, Row } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { EmojiString, EmojiTab, UserSukiEmojis, PostUserSukiResponse as UserSukiResponse } from "@/@types";
import { Emoji as EmojiInterface } from "@/@types/Emoji";
import { DisplayErrorMessage, EmojiSearchTextBox, PostUserSukiButton } from "@/components/atoms";
import { PostEmoteEmojiSelectTabs, TypingEmote } from "@/components/molecules";
import { UserInfoContext } from "@/components/template";
import { emojiSearch, fetchNextjsServer, getHeader, postNextjsServer } from "@/helpers";
import { useError, useIsMobile } from "@/hooks";
import { presetEmojiMap, customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { css } from "ss/css";

type Props = {
    isOpen: boolean;
    onCloseAction: () => void;
};

export function UserSukiPostDrawer({ isOpen, onCloseAction }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<EmojiTab>("preset");
    const [userSukiEmojis, setUserSukiEmojis] = useState<UserSukiEmojis>([undefined, undefined, undefined, undefined]);
    const [searchedPresetEmojis, setSearchedPresetEmojis] = useState<Array<EmojiInterface>>(presetEmojiMap);
    const [searchedCustomEmojis, setSearchedCustomEmojis] = useState<Array<EmojiInterface>>(customEmojiMap);
    const [searchedMemeEmojis, setSearchedMemeEmojis] = useState<Array<EmojiInterface>>(memeEmojiMap);

    const { handledError, handleErrors, hasError } = useError();
    const userInfo = useContext(UserInfoContext)?.userInfo;
    const isMobile = useIsMobile();
    const router = useRouter();

    const {
        data: userSukiResponse,
        isError: isUserSukiError,
        error: userSukiError
    } = useQuery({
        queryKey: ["userSuki"],
        queryFn: async () => {
            const response = await fetchNextjsServer<UserSukiResponse>(
                `/api/userSuki/${userInfo?.userId}`,
                getHeader()
            );
            return response.data;
        }
    });

    const {
        mutateAsync: postUserSuki,
        isPending: isPostUserSukiPending,
        isError: isPostUserSukiError,
        error: postUserSukiError
    } = useMutation({
        mutationFn: async () => {
            await postNextjsServer<UserSukiResponse>(
                `/api/userSuki/${userInfo?.userId}`,
                {
                    userSukiEmoji1: userSukiEmojis[0],
                    userSukiEmoji2: userSukiEmojis[1],
                    userSukiEmoji3: userSukiEmojis[2],
                    userSukiEmoji4: userSukiEmojis[3]
                },
                getHeader()
            );
        }
    });

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
        const userSukiEmojis = userSukiResponse?.userSuki ?? [];
        if (userSukiEmojis.length > 0) {
            const settingUserSukiEmojis = [...userSukiEmojis];
            while (settingUserSukiEmojis.length < 4) {
                settingUserSukiEmojis.push(undefined);
            }
            setUserSukiEmojis(settingUserSukiEmojis as UserSukiEmojis);
        } else {
            setUserSukiEmojis([undefined, undefined, undefined, undefined]);
        }
    }, [userSukiResponse]);

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
        const errors = [
            { isError: isUserSukiError, error: userSukiError },
            { isError: isPostUserSukiError, error: postUserSukiError }
        ];

        errors.forEach(({ isError, error }) => {
            if (isError && error) {
                try {
                    handleErrors(JSON.parse(error.message));
                } catch (error) {
                    console.error("Error parsing error message:", error);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPostUserSukiError, postUserSukiError, isUserSukiError, userSukiError]);

    return (
        <Drawer open={isOpen} closable={true} onClose={onCloseAction} placement="bottom" width={500} height="100%">
            <div className={emojiDialogStyle}>
                {hasError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
                <div className={emojiPostDrawerTitleStyle}>あなたの「スキ」を登録しよう</div>
                <Row justify="space-between" align="middle" className="mb-4">
                    <Col span={isMobile ? 21 : 22}>
                        <Row align="middle" style={{ fontSize: isMobile ? "28px" : "56px" }} role="listbox">
                            <TypingEmote userSukiEmojis={userSukiEmojis} onEmojiDeleteClick={onEmojiDeleteClick} />
                        </Row>
                    </Col>
                    <Col span={isMobile ? 3 : 2}>
                        <PostUserSukiButton isProcessing={isPostUserSukiPending} onSendClick={onSendClick} />
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
