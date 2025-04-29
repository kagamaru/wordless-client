import { Emoji } from "@/@types";
import { EmojiCategory, EmojiType } from "@/@types/Emoji";

export const memes: Array<Emoji> = [
    {
        emojiCategory: EmojiCategory.Meme,
        emojiType: EmojiType.Memes,
        emojiId: ":party_parrot:",
        emojiJapaneseId: "パーティパロット、パーティーパロット",
        url: "https://partyparrotasaservice.vercel.app/api/partyparrot"
    }
    //　NOTE:　今後他のエモジを追加する可能性があります
];
