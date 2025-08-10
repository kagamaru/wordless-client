import { Col, Row } from "antd";
import { UserSukiEmojis } from "@/@types";
import { EditButton, Emoji } from "@/components/atoms";
import { css } from "ss/css";
import { useRouter } from "next/navigation";
import { useParamUserId } from "@/hooks";

type Props = {
    userSukiEmojis: UserSukiEmojis | [];
};

export const CurrentUserSukiSection = ({ userSukiEmojis }: Props) => {
    const router = useRouter();
    const formattedUserId = useParamUserId();

    const emojiSizeStyle = css({
        fontSize: "32px !important",
        marginTop: "12px"
    });

    const emojis = userSukiEmojis.map((emoji, index) => {
        return (
            // NOTE: 本来indexをkeyに設定するのは好ましくないが
            // NOTE: ここでは入れ替えが発生しないことが保証されているため
            // NOTE: 問題ないと判断してindexをkeyに設定している
            <Col key={index} role="listitem" aria-label={`ユーザーが好きなもの：${emoji}`}>
                <Emoji emojiId={emoji} size={32} />
            </Col>
        );
    });

    const onEditClick = () => {
        router.push(`/user/${formattedUserId}/registration/usersuki`);
    };

    return (
        <Row
            align="middle"
            justify="center"
            gutter={8}
            className={emojiSizeStyle}
            role="list"
            aria-label="ユーザーが好きなもの一覧"
        >
            <Col>
                <Row align="middle">
                    <Emoji emojiId=":suki:" size={32} />
                    <div>：</div>
                </Row>
            </Col>
            {emojis}
            <Col className="ml-3">
                <EditButton ariaLabel="ユーザースキ変更ボタン" onClickAction={onEditClick} />
            </Col>
        </Row>
    );
};
