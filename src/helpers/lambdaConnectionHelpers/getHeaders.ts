export const getHeaders = (token: string): { headers: Record<string, string> } => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
};
