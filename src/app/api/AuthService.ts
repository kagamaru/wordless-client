import {
    AuthenticationResultType,
    CognitoIdentityProviderClient,
    InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION ?? ""
});

export class AuthService {
    public signin = async (credentials: {
        email: string;
        password: string;
    }): Promise<AuthenticationResultType | undefined> => {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
                AuthParameters: {
                    USERNAME: credentials.email,
                    PASSWORD: credentials.password
                }
            });

            const response = await client.send(command);
            return response.AuthenticationResult;
        } catch (error) {
            throw error;
        }
    };
}
