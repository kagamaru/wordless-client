import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import {
    BaseButton,
    DisplayErrorMessage,
    EmailAddressInput,
    LinkButton,
    PasswordInput,
    SampleLoginButton
} from "@/components/atoms";
import { getErrorMessage, postWithTimeout } from "@/helpers";

const env = process.env;
const sampleUsers = {
    Nozomi: {
        emailAddress: env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS,
        password: env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_PASSWORD
    },
    Nico: {
        emailAddress: env.NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS,
        password: env.NEXT_PUBLIC_SAMPLE_USER_NICO_PASSWORD
    }
};

export function LoginTab() {
    const [form] = Form.useForm();
    const router = useRouter();

    const { mutateAsync, isError } = useMutation({
        mutationFn: async (request: { email: string; password: string }) => {
            const response = await postWithTimeout<AuthenticationResultType>(`/api/cognito/login`, {
                email: request.email,
                password: request.password
            });
            return response.data;
        }
    });

    const onLoginClick = async () => {
        try {
            await form.validateFields({
                recursive: true
            });
        } catch {
            return;
        }

        try {
            const loginResult = await mutateAsync({
                email: form.getFieldValue("emailAddress"),
                password: form.getFieldValue("password")
            });

            if (loginResult) {
                localStorage.setItem("IdToken", loginResult.IdToken ?? "");
                localStorage.setItem("AccessToken", loginResult.AccessToken ?? "");
            } else {
                throw new Error();
            }

            router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    const onSampleLoginClick = async (sampleUserName: "Nozomi" | "Nico") => {
        const userInfo = sampleUsers[sampleUserName];
        form.setFieldsValue({
            emailAddress: userInfo.emailAddress,
            password: userInfo.password
        });
        await onLoginClick();
    };

    return (
        <>
            {isError && (
                <DisplayErrorMessage
                    error={{ errorCode: "COG-01", errorMessage: getErrorMessage("COG-01") }}
                    alignLeft={true}
                ></DisplayErrorMessage>
            )}
            <Form form={form} onFinish={onLoginClick}>
                <EmailAddressInput />
                <PasswordInput />
                <BaseButton label="ログイン" loading={false} />
                <LinkButton label="パスワードを忘れた場合" routerPath="/auth/forgetPassword/emailAddressInput" />
                <SampleLoginButton sampleUserName="Nozomi" onClickAction={() => onSampleLoginClick("Nozomi")} />
                <SampleLoginButton sampleUserName="Nico" onClickAction={() => onSampleLoginClick("Nico")} />
            </Form>
        </>
    );
}
