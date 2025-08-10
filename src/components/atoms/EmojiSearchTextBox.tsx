import { Input } from "antd";

type Props = {
    searchTerm: string;
    onEmojiSearch: (searchTerm: string) => void;
};

export function EmojiSearchTextBox({ searchTerm, onEmojiSearch }: Props) {
    return (
        <Input
            placeholder="絵文字を検索..."
            value={searchTerm}
            onChange={(e) => onEmojiSearch(e.target.value)}
            allowClear
        />
    );
}
