import { Button, ConfigProvider } from "antd";

type Props = {
    onClickAction: () => void;
    isPending: boolean;
};

export const DeleteButton = ({ onClickAction, isPending }: Props) => {
    return (
        <ConfigProvider wave={{ disabled: true }}>
            <Button danger type="primary" onClick={onClickAction} loading={isPending}>
                削除する
            </Button>
        </ConfigProvider>
    );
};
