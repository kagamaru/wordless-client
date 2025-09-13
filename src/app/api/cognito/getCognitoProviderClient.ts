import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const getCognitoProviderClient = () => {
    return new CognitoIdentityProviderClient({
        region: process.env.REGION_AWS ?? ""
    });
};
