"use client";

import { Avatar, Button, Col, Divider, Row } from "antd";
import * as emoji from "node-emoji";
import { css } from "ss/css";

export function WordlessPost() {
    const wordlessPost = css({
        paddingLeft: { base: "16px", lg: "140px" },
        paddingRight: { base: "16px", lg: "140px" },
        marginTop: "20px"
    });

    const avatar = css({
        height: { base: "32px", lg: "50px !important" },
        width: { base: "32px", lg: "50px !important" }
    });

    const textBlock = css({
        marginBottom: "2px"
    });

    const authorText = css({
        fontSize: { base: "24px", lg: "28px" },
        color: "black !important",
        marginLeft: { base: "8px", lg: "0px" }
    });

    const smallText = css({
        marginBottom: { base: "4px", lg: "7px" },
        marginLeft: { base: "8px", lg: "20px" },
        fontSize: "12px",
        color: "grey"
    });

    const emojiRow = css({
        marginLeft: { base: "8px", lg: "0px" },
        fontSize: "48px !important"
    });

    const divider = css({
        margin: "0px !important",
        borderTop: "1px solid !important",
        borderColor: "lightGrey !important"
    });

    const sharedButtonClass = {
        height: "24px !important",
        width: "20px",
        marginTop: "4px"
    };

    const button = css({
        ...sharedButtonClass
    });

    const emojiButton = css({
        ...sharedButtonClass,
        width: "60px",
        marginLeft: "4px"
    });

    return (
        <>
            <div className={wordlessPost}>
                <Row>
                    <Col span={2} className="m-auto">
                        <Avatar
                            className={avatar}
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        ></Avatar>
                    </Col>
                    <Col span={22}>
                        <Row align="bottom" className={textBlock}>
                            <div className={authorText}>Yanami Anna</div>
                            <div className={smallText}>@annna_yanami</div>
                            <div className={smallText}>2024-12-12 18:09</div>
                        </Row>
                        <Divider className={divider} />
                        <Row className={emojiRow}>
                            <div>{emoji.get(":heart:")}</div>
                            <div>{emoji.get(":bear:")}</div>
                            <div>{emoji.get(":dragon:")}</div>
                            <div>{emoji.get(":gun:")}</div>
                        </Row>
                        <Row className={"mb-3"}>
                            <Button shape="round" className={button}>
                                +
                            </Button>
                            <Button shape="round" className={emojiButton}>
                                <span>{emoji.get(":smile:")}</span>
                                <span>1</span>
                            </Button>
                            <Button shape="round" className={emojiButton}>
                                <span>{emoji.get(":fish:")}</span>
                                <span>23</span>
                            </Button>
                            <Button shape="round" className={emojiButton}>
                                <span>{emoji.get(":computer:")}</span>
                                <span>23</span>
                            </Button>
                            <Button shape="round" className={emojiButton}>
                                <span>{emoji.get(":dog:")}</span>
                                <span>23</span>
                            </Button>
                            <Button shape="round" className={emojiButton}>
                                <span>{emoji.get(":bird:")}</span>
                                <span>23</span>
                            </Button>
                        </Row>
                    </Col>
                </Row>
                <Divider className={divider} />
            </div>
        </>
    );
}
