import React from "react";
import Button, { TButtonVariant } from "./Button";
import Modal from "./Modal";
import Typography from "./Typography";

interface IConfirmationModalProps {
  open: boolean;
  onClose: ({ confirmed }: { confirmed: boolean }) => void;
  title: string;
  description: string;
  confirmText: string;
  confirmButtonVariant: TButtonVariant;
  cancelText: string;
  cancelButtonVariant: TButtonVariant;
}

function ConfirmationModal(props: Partial<IConfirmationModalProps>) {
  const {
    open,
    cancelButtonVariant = "link",
    confirmButtonVariant = "danger",
    cancelText = "Cancel",
    confirmText = "Yes, delete it",
    description = "You won't be able to revert this",
    title = "Delete this item?",
    onClose = ({ confirmed }: { confirmed: boolean }) => {},
  } = props;
  return (
    <Modal open={open} onClose={() => onClose({ confirmed: false })}>
      <Typography variant="h4" className="font-medium text-center">
        {title}
      </Typography>
      <Typography className="my-2 text-center">{description}</Typography>

      <div className="flex gap-2 justify-center">
        <Button
          variant={confirmButtonVariant}
          onClick={() => onClose({ confirmed: true })}
        >
          {confirmText}
        </Button>
        <Button
          variant={cancelButtonVariant}
          onClick={() => onClose({ confirmed: false })}
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
