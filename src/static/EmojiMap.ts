import { Emoji } from "@/@types/Emoji";
import { travelPlacesEmojis } from "./emojis/TravelPlacesEmojis";
import { animalsNatureEmojis } from "./emojis/AnimalsNatureEmojis";
import { customEmojis } from "./emojis/CustomEmojis";
import { foodDrinkEmojis } from "./emojis/FoodDrinkEmojis";
import { memeEmojis } from "./emojis/MemesEmojis";
import { peopleBodyEmojis } from "./emojis/PeopleBodyEmojis";
import { smileysEmotionEmojis } from "./emojis/SmileysEmotionEmojis";
import { objectsEmojis } from "./emojis/ObjectsEmojis";
import { activitiesEmojis } from "./emojis/ActivitiesEmojis";
import { flagsEmojis } from "./emojis/FlagsEmojis";
import { symbolsEmojis } from "./emojis/SymbolsEmoji";
export const presetEmojiMap: Array<Emoji> = [
    ...smileysEmotionEmojis,
    ...peopleBodyEmojis,
    ...animalsNatureEmojis,
    ...foodDrinkEmojis,
    ...travelPlacesEmojis,
    ...objectsEmojis,
    ...activitiesEmojis,
    ...flagsEmojis,
    ...symbolsEmojis
];

export const customEmojiMap: Array<Emoji> = [
    ...customEmojis.map((emoji) => ({
        ...emoji,
        url: `${process.env.NEXT_PUBLIC_S3_URL}/custom/${emoji.emojiId.replaceAll(":", "")}.png`
    }))
];

export const memeEmojiMap: Array<Emoji> = [
    ...memeEmojis.map((emoji) => ({
        ...emoji,
        url: `${process.env.NEXT_PUBLIC_S3_URL}/meme/${emoji.emojiId.replaceAll(":", "")}.gif`
    }))
];
