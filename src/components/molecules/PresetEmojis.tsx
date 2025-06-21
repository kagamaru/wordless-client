import { EmojiString } from "@/@types";
import { Emoji as EmojiInterface, EmojiType } from "@/@types/Emoji";
import { EmojiButtonBlocksByType } from "@/components/molecules";
import { presetEmojiMap } from "@/static/EmojiMap";

type Props = {
    onEmojiClick: (emojiId: EmojiString) => void;
};

export function PresetEmojis({ onEmojiClick }: Props) {
    const smileysEmotion: Array<EmojiInterface> = [];
    const peopleBody: Array<EmojiInterface> = [];
    const animalsNature: Array<EmojiInterface> = [];
    const foodDrink: Array<EmojiInterface> = [];
    const travelPlaces: Array<EmojiInterface> = [];
    const activities: Array<EmojiInterface> = [];
    const objects: Array<EmojiInterface> = [];
    const symbols: Array<EmojiInterface> = [];
    const flags: Array<EmojiInterface> = [];

    presetEmojiMap.map((emoji) => {
        switch (emoji.emojiType) {
            case EmojiType.SmileysEmotion:
                smileysEmotion.push(emoji);
                break;
            case EmojiType.PeopleBody:
                peopleBody.push(emoji);
                break;
            case EmojiType.AnimalsNature:
                animalsNature.push(emoji);
                break;
            case EmojiType.FoodDrink:
                foodDrink.push(emoji);
                break;
            case EmojiType.TravelPlaces:
                travelPlaces.push(emoji);
                break;
            case EmojiType.Activities:
                activities.push(emoji);
                break;
            case EmojiType.Objects:
                objects.push(emoji);
                break;
            case EmojiType.Symbols:
                symbols.push(emoji);
                break;
            case EmojiType.Flags:
                flags.push(emoji);
                break;
            default:
                break;
        }
    });

    return (
        [
            [smileysEmotion, "笑顔と感情"],
            [peopleBody, "人と身体"],
            [animalsNature, "動物と自然"],
            [foodDrink, "食べ物と飲み物"],
            [travelPlaces, "旅行と場所"],
            [activities, "活動"],
            [objects, "オブジェクト"],
            [symbols, "記号"],
            [flags, "国旗"]
        ] as Array<[Array<EmojiInterface>, string]>
    ).map(([emojis, label]) => {
        return (
            <EmojiButtonBlocksByType
                key={label}
                typeName={label}
                emojis={emojis}
                onClickAction={(emojiId) => onEmojiClick(emojiId)}
            />
        );
    });
}
