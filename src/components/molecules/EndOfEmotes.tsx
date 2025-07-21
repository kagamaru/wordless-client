import { Row } from "antd";
import { LastEmoteFetchedText, LoadMoreButton } from "@/components/atoms";

type Props = {
    hasLastEmoteFetched: boolean;
    isFetchingMoreEmotes: boolean;
    loadMoreEmotesAction: () => void;
};

export function EndOfEmotes({ hasLastEmoteFetched, isFetchingMoreEmotes, loadMoreEmotesAction }: Props) {
    return (
        <Row justify="center" align="middle" className="mt-4 mb-8">
            {hasLastEmoteFetched ? (
                <LastEmoteFetchedText />
            ) : (
                <LoadMoreButton isLoading={isFetchingMoreEmotes} onClickAction={loadMoreEmotesAction} />
            )}
        </Row>
    );
}
