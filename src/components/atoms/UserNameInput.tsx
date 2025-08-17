import { Form, Input } from "antd";
import { css } from "ss/css";

const usernamePattern = /^[A-Za-z0-9._-]+$/;

export const UserNameInput = () => {
    const inputRequirementsStyle = css({
        marginTop: 2,
        marginBottom: 3,
        color: "grey !important"
    });

    return (
        <>
            <Form.Item
                label="ユーザー名："
                name="username"
                rules={[
                    { required: true, message: "ユーザー名を入力してください。" },
                    { min: 1, max: 24, message: "1文字〜24文字で入力してください。" },
                    {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve(); // required ルールに委ねる
                            return usernamePattern.test(value)
                                ? Promise.resolve()
                                : Promise.reject(
                                      new Error(
                                          "使用できる文字は英数字・ドット(.)・アンダースコア(_)・ハイフン(-)です。"
                                      )
                                  );
                        }
                    }
                ]}
            >
                <Input placeholder="例) Wordless_01" allowClear />
            </Form.Item>
            <div className={inputRequirementsStyle}>
                <div>1文字〜24文字で入力してください。</div>
                <div>使用できる文字は英数字・ドット(.)・アンダースコア(_)・ハイフン(-)です。</div>
            </div>
        </>
    );
};
