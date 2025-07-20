import { Button, Row } from "antd";
import { css } from "ss/css";

type Props = {
    totalNumberOfFollowers: number;
    onClickAction: () => void;
};

export const TotalNumberOfFollowers: React.FC<Props> = ({ totalNumberOfFollowers, onClickAction }) => {
    const followButtonTextStyle = css({
        fontSize: 20
    });

    return (
        <Row align="middle" justify="center">
            <Button type="link" className="p-0 mr-1" onClick={onClickAction}>
                <span className={followButtonTextStyle}>{totalNumberOfFollowers}</span>
            </Button>
            <div>フォロワー</div>
        </Row>
    );
};
