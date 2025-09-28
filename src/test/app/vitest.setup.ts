import { EmojiCategory, EmojiType } from "@/@types/Emoji";
import { vi } from "vitest";

const { getComputedStyle } = window;

export const vitestSetup = (): void => {
    window.matchMedia =
        window.matchMedia ||
        function () {
            return {
                matches: false,
                addListener: function () {},
                removeListener: function () {}
            };
        };

    window.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    window.getComputedStyle = (elt) => getComputedStyle(elt);

    window.scrollTo = () => {};

    vi.mock("@/static/EmojiMap", () => ({
        presetEmojiMap: [
            {
                emojiCategory: EmojiCategory.Preset,
                emojiType: EmojiType.SmileysEmotion,
                emojiId: ":smiling_face:",
                emojiJapaneseId: "笑顔",
                emojiChar: "☺️"
            },
            {
                emojiCategory: EmojiCategory.Preset,
                emojiType: EmojiType.AnimalsNature,
                emojiId: ":rat:",
                emojiJapaneseId: "ラット、動物",
                emojiChar: "🐀"
            },
            {
                emojiCategory: EmojiCategory.Preset,
                emojiType: EmojiType.AnimalsNature,
                emojiId: ":cow:",
                emojiJapaneseId: "牛、動物、農場、ミルク",
                emojiChar: "🐄"
            },
            {
                emojiCategory: EmojiCategory.Preset,
                emojiType: EmojiType.AnimalsNature,
                emojiId: ":tiger:",
                emojiJapaneseId: "トラ、動物、大型猫、捕食者、動物園",
                emojiChar: "🐅"
            },
            {
                emojiCategory: EmojiCategory.Preset,
                emojiType: EmojiType.AnimalsNature,
                emojiId: ":rabbit:",
                emojiJapaneseId: "ウサギ、動物、ペット",
                emojiChar: "🐇"
            }
        ],
        customEmojiMap: [
            {
                emojiCategory: EmojiCategory.Custom,
                emojiType: EmojiType.Custom,
                emojiId: ":test:",
                emojiJapaneseId: "テスト",
                url: "https://example.com/test.png"
            },
            {
                emojiCategory: EmojiCategory.Custom,
                emojiType: EmojiType.Custom,
                emojiId: ":last:",
                emojiJapaneseId: "ラスト",
                url: "https://example.com/last.png"
            }
        ],
        memeEmojiMap: [
            {
                emojiCategory: EmojiCategory.Meme,
                emojiType: EmojiType.Memes,
                emojiId: ":neko_meme_surprising_cat:",
                emojiJapaneseId: "猫ミーム_驚く猫",
                url: "https://example.com/neko_meme_surprising_cat.gif"
            },
            {
                emojiCategory: EmojiCategory.Meme,
                emojiType: EmojiType.Memes,
                emojiId: ":party_parrot:",
                emojiJapaneseId: "パーティパロット",
                url: "https://example.com/party_parrot.gif"
            }
        ]
    }));
};
