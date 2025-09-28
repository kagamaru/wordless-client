import { useMutation } from "@tanstack/react-query";
import { Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { BaseButton, DisplayErrorMessage, PasswordInput } from "@/components/atoms";
import { getErrorMessage, getHeader, postNextjsServer } from "@/helpers";
import { useParamUserId } from "@/hooks";

export const ChangePasswordForm = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const userId = useParamUserId();
    const isSampleUser =
        userId === process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_ID ||
        userId === process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_USER_ID;

    const {
        mutateAsync: postChangePasswordAsyncAPI,
        isPending,
        isError
    } = useMutation({
        mutationFn: async (values: { currentPassword: string; newPassword: string }) => {
            const response = await postNextjsServer<void>(
                `/api/cognito/changePassword`,
                {
                    accessToken: localStorage.getItem("AccessToken") ?? "",
                    previousPassword: values.currentPassword,
                    proposedPassword: values.newPassword
                },
                getHeader()
            );
            return response;
        }
    });

    const onPasswordChangeClick = async (values: { currentPassword: string; newPassword: string }) => {
        if (isSampleUser) {
            return;
        }

        try {
            await postChangePasswordAsyncAPI(values);
            router.push(`/user/${userId}/settings/password/completion`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {isError && (
                <DisplayErrorMessage
                    error={{ errorCode: "COG-02", errorMessage: getErrorMessage("COG-02") }}
                ></DisplayErrorMessage>
            )}
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
                <BaseButton label="パスワード変更" loading={isPending} />
            </Form>
        </>
    );
};
