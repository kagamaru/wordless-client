import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
import { useRef, useState } from "react";
import { css } from "ss/css";

type Props = {
    onClickAction: (fileData: FormData) => Promise<void>;
};

export const SyncButton = ({ onClickAction }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    const syncButtonStyle = css({
        borderColor: "primary !important",
        color: "primary !important"
    });

    const onClickAsync = async () => {
        inputRef.current?.click();
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0] ?? null;

        // NOTE: 同じファイルを連続選択してもchangeを発火させるために毎回リセット
        e.target.value = "";

        if (!file || file.size === 0) return;

        const form = new FormData();
        form.append("file", file, file.name);

        setLoading(true);
        try {
            await onClickAction(form);
        } catch {
            console.error("Post Image Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <input
                    data-testid="file-input"
                    ref={inputRef}
                    type="file"
                    accept={"image/*"}
                    onChange={handleChange}
                    style={{ display: "none" }}
                />
                <Button
                    shape="circle"
                    size="small"
                    icon={loading ? <LoadingOutlined /> : <SyncOutlined />}
                    className={syncButtonStyle}
                    aria-label="ユーザー画像変更ボタン"
                    aria-disabled={loading}
                    onClick={onClickAsync}
                />
            </ConfigProvider>
        </>
    );
};
