import { TotalNumberOfFollowers, TotalNumberOfFollowing } from "@/components/atoms";
import { Col, Divider, Row } from "antd";

export const FollowButtonSection = () => {
    return (
        <>
            <Row gutter={16} className="mt-4">
                <Col span={12}>
                    <TotalNumberOfFollowing totalNumberOfFollowing={100} />
                </Col>
                <Col span={12}>
                    <TotalNumberOfFollowers totalNumberOfFollowers={200} />
                </Col>
            </Row>

            <Divider />
        </>
    );
};
