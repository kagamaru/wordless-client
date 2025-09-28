import { Form, Input } from "antd";
import { css } from "ss/css";

const userIdPattern = /^[a-z0-9_]+$/;

export const UserIdInput = () => {
    const inputRequirementsStyle = css({
        marginTop: 2,
        marginBottom: 3,
        color: "grey !important"
    });

    return (
        <>
            <Form.Item
                label="ユーザーID："
                name="userId"
                rules={[
                    { required: true, message: "ユーザーIDを入力してください。" },
                    { min: 1, max: 23, message: "1文字〜23文字で入力してください。" },
                    {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve(); // required ルールに委ねる
                            return userIdPattern.test(value)
                                ? Promise.resolve()
                                : Promise.reject(new Error("使用できる文字は英小文字・数字・アンダースコア(_)です。"));
                        }
                    }
                ]}
            >
                <Input placeholder="例) wordless_01" allowClear />
            </Form.Item>
            <div className={inputRequirementsStyle}>
                <div>1文字〜23文字で入力してください。</div>
                <div>使用できる文字は英小文字・数字・アンダースコア(_)です。</div>
            </div>
        </>
    );
};
