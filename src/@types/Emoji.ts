import { EmojiString } from "@/@types/EmojiString";

export type Emoji = {
    emojiCategory: EmojiCategory;
    emojiType: EmojiType;
    emojiId: EmojiString;
    emojiJapaneseId: string;
    url?: string;
};

export enum EmojiCategory {
    "Preset" = 1,
    "Custom" = 2,
    "Meme" = 3
}

export enum EmojiType {
    "SmileysEmotion" = 1,
    "PeopleBody" = 2,
    "AnimalsNature" = 3,
    "FoodDrink" = 4,
    "TravelPlaces" = 5,
    "Activities" = 6,
    "Objects" = 7,
    "Symbols" = 8,
    "Flags" = 9
}
