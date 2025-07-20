import { TotalNumberOfFollowers, TotalNumberOfFollowing } from "@/components/atoms";
import { Col, Divider, Row } from "antd";

type Props = {
    totalNumberOfFollowers: number;
    onFollowersClickAction: () => void;
    totalNumberOfFollowing: number;
    onFollowingClickAction: () => void;
};

export const FollowButtonSection = ({
    totalNumberOfFollowers,
    onFollowersClickAction,
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
                    <TotalNumberOfFollowers
                        totalNumberOfFollowers={totalNumberOfFollowers}
                        onClickAction={onFollowersClickAction}
                    />
                </Col>
            </Row>

            <Divider />
        </>
    );
};
