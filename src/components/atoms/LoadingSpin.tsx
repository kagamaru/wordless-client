import { LoadingOutlined } from "@ant-design/icons";
import { Row, Spin } from "antd";

export const LoadingSpin = () => {
    return (
        <Row justify="center" align="middle">
            <Spin
                indicator={
                    <LoadingOutlined style={{ fontSize: 160, marginTop: "100px", marginBottom: "100px" }} spin />
                }
            />
        </Row>
    );
};
