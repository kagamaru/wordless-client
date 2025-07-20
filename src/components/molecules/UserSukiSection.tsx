import { Col, Row } from "antd";
import { UserSukiEmojis } from "@/@types";
import { Emoji } from "@/components/atoms";
import { css } from "ss/css";

type Props = {
    userSukiEmojis: UserSukiEmojis;
};

export const UserSukiSection = ({ userSukiEmojis }: Props) => {
    const emojiSizeStyle = css({
        fontSize: "32px !important",
        marginTop: "12px"
    });

    const emojis = userSukiEmojis.map((emoji, index) => {
        return (
            // NOTE: 本来indexをkeyに設定するのは好ましくないが
            // NOTE: ここでは入れ替えが発生しないことが保証されているため
            // NOTE: 問題ないと判断してindexをkeyに設定している
            <Col key={index}>
                <Emoji emojiId={emoji} size={32} />
            </Col>
        );
    });

    return (
        <Row align="middle" justify="center" gutter={8} className={emojiSizeStyle}>
            <Col>
                <Row align="middle">
                    <Emoji emojiId=":suki:" size={32} />
                    <div>：</div>
                </Row>
            </Col>
            {emojis}
        </Row>
    );
};
