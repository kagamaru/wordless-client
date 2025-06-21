import { presetEmojiMap, customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { EmojiTab } from "@/@types";
import { Emoji } from "@/@types/Emoji";

export function emojiSearch(searchTerm: string, activeTab: EmojiTab): Array<Emoji> {
    let searchResults: Array<Emoji> = [];
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
}
