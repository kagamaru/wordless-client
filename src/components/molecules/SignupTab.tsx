import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import { BaseButton, DisplayErrorMessage, EmailAddressInput, PasswordInput } from "@/components/atoms";
import { getErrorMessage, postWithTimeout } from "@/helpers";

export const SignupTab = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const { mutateAsync, isError } = useMutation({
        mutationFn: async (request: { email: string; password: string }) => {
            const response = await postWithTimeout<void>(`/api/cognito/signup`, {
                email: request.email,
                password: request.password
            });
            return response.data;
        }
    });

    const onSignupClick = async (values: { emailAddress: string; password: string }) => {
        const emailAddress = values.emailAddress;
        const password = values.password;

        try {
            await form.validateFields({
                recursive: true
            });
        } catch {
            return;
        }

        try {
            await mutateAsync({
                email: emailAddress,
                password
            });

            router.push("/auth/register/confirmationCode");
        } catch {
            return;
        }
    };

    return (
        <>
            {isError && (
                <DisplayErrorMessage
                    error={{ errorCode: "COG-05", errorMessage: getErrorMessage("COG-05") }}
                    alignLeft={true}
                ></DisplayErrorMessage>
            )}
            <Form form={form} onFinish={onSignupClick}>
                <EmailAddressInput />
                <PasswordInput />
                <BaseButton label="ユーザー登録" loading={false} />
            </Form>
        </>
    );
};
