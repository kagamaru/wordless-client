import { Emoji } from "@/@types/Emoji";
import { travelPlacesEmojis } from "./emojis/TravelPlacesEmojis";
import { animalsNatureEmojis } from "./emojis/AnimalsNatureEmojis";
import { customEmojis } from "./emojis/CustomEmojis";
import { foodDrinkEmojis } from "./emojis/FoodDrinkEmojis";
import { memeEmojis } from "./emojis/MemeEmojis";
import { peopleBodyEmojis } from "./emojis/PeopleBodyEmojis";
import { smileysEmotionEmojis } from "./emojis/SmileysEmotionEmojis";
import { objectsEmojis } from "./emojis/ObjectsEmojis";
import { activitiesEmojis } from "./emojis/ActivitiesEmojis";
import { flagsEmojis } from "./emojis/FlagsEmojis";
import { symbolsEmojis } from "./emojis/SymbolsEmoji";
import envConfigMap from "envConfig";

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

const s3Url = envConfigMap.get("NEXT_PUBLIC_S3_URL");
export const customEmojiMap: Array<Emoji> = [
    ...customEmojis.map((emoji) => ({
        ...emoji,
        url: `${s3Url}/custom/${emoji.emojiId.replaceAll(":", "")}.png`
    }))
];

export const memeEmojiMap: Array<Emoji> = memeEmojis;
