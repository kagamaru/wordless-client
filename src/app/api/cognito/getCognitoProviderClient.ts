import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const getCognitoProviderClient = () => {
    console.log("process.env.REGION_AWS", process.env.REGION_AWS);
    return new CognitoIdentityProviderClient({
        region: "us-west-2"
    });
};
