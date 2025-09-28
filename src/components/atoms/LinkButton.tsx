import { Typography } from "antd";
import { useRouter } from "next/navigation";

type Props = {
    label: string;
    routerPath: string;
};

export function LinkButton({ label, routerPath }: Props) {
    const router = useRouter();

    const onLinkClick = () => {
        router.push(routerPath);
    };

    return (
        <div className="mt-5">
            <Typography.Link role="button" onClick={onLinkClick}>
                {label}
            </Typography.Link>
        </div>
    );
}
