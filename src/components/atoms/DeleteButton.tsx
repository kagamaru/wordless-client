import { Button } from "antd";

type Props = {
    onClickAction: () => void;
};

export const DeleteButton = ({ onClickAction }: Props) => {
    return (
        <Button danger type="primary" onClick={onClickAction}>
            削除する
        </Button>
    );
};
