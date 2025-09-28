import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

type Props = {
    label: string;
    onClickAction: () => void;
};

export const ArrowBackButton = ({ label, onClickAction }: Props) => {
    return (
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={onClickAction} aria-label={label}>
            {label}
        </Button>
    );
};
