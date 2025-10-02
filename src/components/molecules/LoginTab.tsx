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
import envConfigMap from "envConfig";

const sampleUserNozomiMailAddress = envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS");
const sampleUserNozomiPassword = envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NOZOMI_PASSWORD");
const sampleUserNicoMailAddress = envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS");
const sampleUserNicoPassword = envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NICO_PASSWORD");

if (
    !sampleUserNozomiMailAddress ||
    !sampleUserNozomiPassword ||
    !sampleUserNicoMailAddress ||
    !sampleUserNicoPassword
) {
    throw new Error("Sample user email or password is not set");
}

const sampleUsers = {
    Nozomi: {
        email: sampleUserNozomiMailAddress,
        password: sampleUserNozomiPassword
    },
    Nico: {
        email: sampleUserNicoMailAddress,
        password: sampleUserNicoPassword
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

    const onLoginClick = async (values: { email: string; password: string }) => {
        const { email, password } = values;

        try {
            await form.validateFields({
                recursive: true
            });
        } catch {
            return;
        }

        try {
            const loginResult = await mutateAsync({
                email,
                password
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
        const { email, password } = userInfo;
        form.setFieldsValue({
            email,
            password
        });
        await onLoginClick(userInfo);
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
                <LinkButton label="パスワードを忘れた場合" routerPath="/auth/forgetPassword/emailInput" />
            </Form>
            <SampleLoginButton sampleUserName="Nozomi" onClickAction={() => onSampleLoginClick("Nozomi")} />
            <SampleLoginButton sampleUserName="Nico" onClickAction={() => onSampleLoginClick("Nico")} />
        </>
    );
}
