import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import envConfigMap from "envConfig";

export const getCognitoProviderClient = () => {
    if (!envConfigMap.get("REGION_AWS")) {
        throw new Error("REGION_AWS is not set");
    }
    return new CognitoIdentityProviderClient({
        region: envConfigMap.get("REGION_AWS")
    });
};
