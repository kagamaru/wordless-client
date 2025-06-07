import { NextResponse } from "next/server";

// NOTE: 外部APIから渡される値のため、anyを許可
/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleAPIError = (error: any): NextResponse => {
    if (error instanceof Error) {
        const errorMessage = JSON.parse(error.message);
        const errorStatus = errorMessage.status;
        const errorData = errorMessage.data;
        return NextResponse.json({ data: errorData }, { status: errorStatus });
    }

    return NextResponse.json({ data: "An error occurred" }, { status: 500 });
};
