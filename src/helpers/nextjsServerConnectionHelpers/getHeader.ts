export function getHeader() {
    return {
        headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("IdToken") ?? ""
        }
    };
}
