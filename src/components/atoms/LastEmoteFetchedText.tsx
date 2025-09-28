import { css } from "ss/css";

export function LastEmoteFetchedText() {
    const lastEmoteFetchedTextStyle = css({
        fontSize: "24px",
        marginTop: "24px"
    });

    return <div className={lastEmoteFetchedTextStyle}>最後のエモートです</div>;
}
