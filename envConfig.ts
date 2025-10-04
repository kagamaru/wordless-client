const envConfigMap = new Map();
envConfigMap.set("NEXT_PUBLIC_WEBSOCKET_URL", process.env.NEXT_PUBLIC_WEBSOCKET_URL);
envConfigMap.set("NEXT_PUBLIC_CLOUDFRONT_URL", process.env.NEXT_PUBLIC_CLOUDFRONT_URL);
envConfigMap.set("NEXT_PUBLIC_API_MOCKING", process.env.NEXT_PUBLIC_API_MOCKING);
envConfigMap.set("REST_API_URL", process.env.REST_API_URL);
envConfigMap.set("REGION_AWS", process.env.REGION_AWS);
envConfigMap.set("COGNITO_CLIENT_ID", process.env.COGNITO_CLIENT_ID);
envConfigMap.set(
    "NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS",
    process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS
);
envConfigMap.set("NEXT_PUBLIC_SAMPLE_USER_NOZOMI_PASSWORD", process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_PASSWORD);
envConfigMap.set("NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_ID", process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_ID);
envConfigMap.set("NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_SUB", process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_SUB);
envConfigMap.set("NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS", process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS);
envConfigMap.set("NEXT_PUBLIC_SAMPLE_USER_NICO_PASSWORD", process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_PASSWORD);
envConfigMap.set("NEXT_PUBLIC_SAMPLE_USER_NICO_USER_ID", process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_USER_ID);
envConfigMap.set("NEXT_PUBLIC_SAMPLE_USER_NICO_USER_SUB", process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_USER_SUB);

envConfigMap.forEach((key, value) => {
    if (!value) {
        throw new Error(`${key} is not set`);
    }
});

export default envConfigMap;
