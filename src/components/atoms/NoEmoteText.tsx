import { Row } from "antd";
import { css } from "ss/css";

export function NoEmoteText() {
    const noEmoteTextStyle = css({
        fontSize: "24px",
        marginTop: "24px"
    });

    return (
        <Row justify="center" align="middle" className="mt-4 mb-8">
            <div className={noEmoteTextStyle}>エモートは投稿されていません</div>
        </Row>
    );
}
