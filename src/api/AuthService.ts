import {
    AuthenticationResultType,
    CognitoIdentityProviderClient,
    GetUserCommand,
    InitiateAuthCommand,
    SignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION ?? ""
});

export class AuthService {
    public signin = async (signinInfo: {
        email: string;
        password: string;
    }): Promise<AuthenticationResultType | undefined> => {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
                AuthParameters: {
                    USERNAME: signinInfo.email,
                    PASSWORD: signinInfo.password
                }
            });

            const response = await client.send(command);
            return response.AuthenticationResult;
        } catch (error) {
            throw error;
        }
    };

    public signup = async (email: string, password: string): Promise<void> => {
        try {
            const command = new SignUpCommand({
                ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
                Username: email,
                Password: password,
                UserAttributes: [{ Name: "email", Value: email }]
            });

            await client.send(command);
        } catch (error) {
            throw error;
        }
    };

    public getUser = async (accessToken: string) => {
        try {
            return await client.send(new GetUserCommand({ AccessToken: accessToken }));
        } catch (error) {
            throw error;
        }
    };
}
