import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const getCognitoProviderClient = () => {
    if (!process.env.REGION_AWS) {
        throw new Error("REGION_AWS is not set");
    }
    return new CognitoIdentityProviderClient({
        region: process.env.REGION_AWS
    });
};
