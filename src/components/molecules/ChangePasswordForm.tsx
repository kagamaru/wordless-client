import { Form, Input } from "antd";
import { ChangePasswordButton, PasswordInput } from "@/components/atoms";

export const ChangePasswordForm = () => {
    const [form] = Form.useForm();

    const onPasswordChangeClick = async (values: { password: string }) => {
        console.log(values);
    };

    return (
        <Form form={form} onFinish={onPasswordChangeClick}>
            <PasswordInput label="現在のパスワード" name="currentPassword" />
            <PasswordInput label="新しいパスワード" name="newPassword" />
            <Form.Item
                label="新しいパスワード（確認）"
                name="newPasswordConfirm"
                dependencies={["newPassword"]}
                rules={[
                    { required: true, message: "パスワードを入力してください" },
                    { min: 7, message: "パスワードは7文字以上で入力してください" },
                    { pattern: /\d/, message: "パスワードには数字を含める必要があります" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("newPassword") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error("新しいパスワードと一致しません"));
                        }
                    })
                ]}
            >
                <Input.Password />
            </Form.Item>
            <ChangePasswordButton />
        </Form>
    );
};
