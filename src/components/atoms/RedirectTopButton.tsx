import { Button, ConfigProvider } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export function RedirectTopButton() {
    const router = useRouter();

    const redirectTop = () => {
        router.push("/");
    };

    return (
        <div className="mt-6 text-center">
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button color="primary" type="primary" icon={<HomeOutlined />} onClick={redirectTop} variant="outlined">
                    トップ画面に戻る
                </Button>
            </ConfigProvider>
        </div>
    );
}
