"use client";

import { GithubOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Divider, Row, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useEmoteStore } from "@/store";
import { css } from "ss/css";

const { Title } = Typography;

export default function Concept() {
    const router = useRouter();

    const contentStyle = css({
        textAlign: "center",
        marginTop: "50px"
    });

    const titleStyle = css({
        color: "primary !important"
    });

    const imageStyle = css({
        marginX: "auto",
        marginY: "32px"
    });

    const finPhraseStyle = css({
        fontSize: "20px",
        fontWeight: "bold"
    });

    const githubButtonStyle = css({
        fontSize: "24px !important"
    });

    const onRedirectToTopPage = () => {
        router.push("/");
    };

    useEffect(() => {
        useEmoteStore.getState().cleanAllData();
    }, []);

    return (
        <Row justify="center">
            <div className={contentStyle}>
                <Title level={1}>絵文字だけで気持ちを伝える、新しいSNS</Title>
                <Title level={2} className={titleStyle}>
                    Wordless（ワードレス）
                </Title>
                <Image src="/wordlessIcon.png" alt="Wordless" width={100} height={100} className={imageStyle} />
                <p>Wordlessは、絵文字だけで投稿・リアクション・交流ができるSNSです。</p>
                <p className="mt-1">あえて言葉を使わないことで、感情が主役になり、</p>
                <p className="mt-1">傷つける言葉や炎上のない空間が生まれます。</p>
                <Divider />
                <ul className="m-5">
                    <li>
                        <Row align="middle" justify="center">
                            <span className="mr-2">😉</span>投稿やリアクションは、すべて絵文字で
                        </Row>
                    </li>
                    <li className="mt-2">
                        <Row align="middle" justify="center">
                            <span className="mr-2">📱</span>シンプルなUI。スマホでもPCでも快適
                        </Row>
                    </li>
                    <li className="mt-2">
                        <Row align="middle" justify="center">
                            <span className="mr-2">👦</span>子どもやSNSに疲れた大人でも安心
                        </Row>
                    </li>
                </ul>
                <Divider />
                <p className={finPhraseStyle}>「言葉がなくても、伝わることがある」</p>
                <p className={finPhraseStyle}>Wordlessは、そんな瞬間を届けたいと考えています。</p>

                <div className="text-center mt-5">
                    <div>
                        <Button
                            type="link"
                            icon={<GithubOutlined />}
                            className={githubButtonStyle}
                            onClick={() => window.open("https://github.com/kagamaru?tab=repositories", "_blank")}
                        >
                            <span>作者GitHub</span>
                        </Button>
                    </div>
                    <div className="mt-5">
                        <span>メールアドレス：</span>
                        <a href="mailto:01a17124@gmail.com">01a17124@gmail.com</a>
                    </div>
                    <div className="m-5">
                        {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                        <ConfigProvider wave={{ disabled: true }}>
                            <Button onClick={onRedirectToTopPage}>トップページへ</Button>
                        </ConfigProvider>
                    </div>
                </div>
            </div>
        </Row>
    );
}
