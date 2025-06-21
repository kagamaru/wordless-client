import { presetEmojiMap, customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { EmojiTab } from "@/@types";
import { Emoji } from "@/@types/Emoji";

export function emojiSearch(searchTerm: string, activeTab: EmojiTab): Array<Emoji> {
    let searchResults: Array<Emoji> = [];
    const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(searchTerm);

    function filterEmojis(emojis: Array<Emoji>, isJapanese: boolean) {
        return emojis.filter((emoji) =>
            isJapanese ? emoji.emojiJapaneseId?.includes(searchTerm) : emoji.emojiId.includes(searchTerm)
        );
    }

    switch (activeTab) {
        case "preset":
            searchResults = filterEmojis(presetEmojiMap, isJapanese);
            break;
        case "custom":
            searchResults = filterEmojis(customEmojiMap, isJapanese);
            break;
        case "meme":
            searchResults = filterEmojis(memeEmojiMap, isJapanese);
            break;
    }

    return searchResults;
}
