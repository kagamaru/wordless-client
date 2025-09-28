import { TotalNumberOfFollowees, TotalNumberOfFollowing } from "@/components/atoms";
import { Col, Divider, Row } from "antd";

type Props = {
    totalNumberOfFollowees: number;
    onFolloweesClickAction: () => void;
    totalNumberOfFollowing: number;
    onFollowingClickAction: () => void;
};

export const FollowButtonSection = ({
    totalNumberOfFollowees,
    onFolloweesClickAction,
    totalNumberOfFollowing,
    onFollowingClickAction
}: Props) => {
    return (
        <>
            <Row gutter={16} className="mt-4">
                <Col span={12}>
                    <TotalNumberOfFollowing
                        totalNumberOfFollowing={totalNumberOfFollowing}
                        onClickAction={onFollowingClickAction}
                    />
                </Col>
                <Col span={12}>
                    <TotalNumberOfFollowees
                        totalNumberOfFollowees={totalNumberOfFollowees}
                        onClickAction={onFolloweesClickAction}
                    />
                </Col>
            </Row>

            <Divider />
        </>
    );
};
