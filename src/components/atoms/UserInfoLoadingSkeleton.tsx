import { Skeleton } from "antd";

export function UserInfoLoadingSkeleton() {
    return (
        <>
            <div role="status" aria-busy="true">
                <Skeleton active />
            </div>
        </>
    );
}
