import { Modal } from "antd";
import { CancelButton, DeleteButton } from "@/components/atoms";
import { css } from "ss/css";

type Props = {
    isOpen: boolean;
    isDeletingEmote: boolean;
    onClose: () => void;
    onDelete: () => void;
};

export function DeleteEmoteDialog({ isOpen, isDeletingEmote, onClose, onDelete }: Props) {
    const deleteDialogStyle = css({
        maxWidth: 400,
        width: "90%"
    });

    const buttonBlockStyle = css({
        marginTop: "24px",
        textAlign: "right"
    });

    return (
        <>
            <Modal
                open={isOpen}
                onCancel={onClose}
                footer={null} // NOTE: カスタムフッターを使うのでデフォルトを無効化
                centered
                className={deleteDialogStyle}
            >
                <div>エモートを削除します。</div>
                <div>削除したエモートは戻せません。</div>

                <div className={buttonBlockStyle}>
                    <CancelButton onClickAction={onClose} />
                    <DeleteButton onClickAction={onDelete} isPending={isDeletingEmote} />
                </div>
            </Modal>
        </>
    );
}
