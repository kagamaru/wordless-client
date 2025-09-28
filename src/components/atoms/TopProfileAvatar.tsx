import { Avatar } from "antd";

type Props = {
    userAvatarUrl: string;
    userName: string;
};

export const TopProfileAvatar = ({ userAvatarUrl, userName }: Props) => {
    return <Avatar size={80} src={userAvatarUrl} alt={userName + "のトッププロフィール画像"} />;
};
