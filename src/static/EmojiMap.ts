import { Emoji } from "@/@types/Emoji";
import { travelPlacesEmojis } from "./emojis/TravelPlacesEmojis";
import { animalsNatureEmojis } from "./emojis/AnimalsNatureEmojis";
import { foodDrinkEmojis } from "./emojis/FoodDrinkEmojis";
import { memes } from "./emojis/Memes";
import { peopleBodyEmojis } from "./emojis/PeopleBodyEmojis";
import { smileysEmotionEmojis } from "./emojis/SmileysEmotionEmojis";
import { objectsEmojis } from "./emojis/ObjectsEmojis";
import { activitiesEmojis } from "./emojis/ActivitiesEmojis";
import { flagsEmojis } from "./emojis/FlagsEmojis";

export const emojiMap: Array<Emoji> = [
    ...smileysEmotionEmojis,
    ...peopleBodyEmojis,
    ...animalsNatureEmojis,
    ...foodDrinkEmojis,
    ...travelPlacesEmojis,
    ...objectsEmojis,
    ...activitiesEmojis,
    ...flagsEmojis,
    ...memes
];
