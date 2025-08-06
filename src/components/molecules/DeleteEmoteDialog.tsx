import { Modal } from "antd";
import { CancelButton, DeleteButton } from "@/components/atoms";
import { css } from "ss/css";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
};

export function DeleteEmoteDialog({ isOpen, onClose, onDelete }: Props) {
    const handleDelete = () => {
        // TODO: エモート削除を画面から呼び出す
        console.log("エモート削除");
        onDelete();
    };

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
                    <DeleteButton onClickAction={handleDelete} />
                </div>
            </Modal>
        </>
    );
}
