import { Emoji } from "@/@types/Emoji";
import { travelPlacesEmojis } from "./emojis/TravelPlacesEmojis";
import { animalsNatureEmojis } from "./emojis/AnimalsNatureEmojis";
import { foodDrinkEmojis } from "./emojis/FoodDrinkEmojis";
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

export const customEmojiMap: Array<Emoji> = [];

export const memeEmojiMap: Array<Emoji> = [];
