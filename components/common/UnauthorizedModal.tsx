import { AuthContext } from "context/authContext";
import React, { useContext } from "react";
import Button from "./Button";
import Modal from "./Modal";
import Typography from "./Typography";

interface UnauthorizedModalPropsInterface {
  open: boolean;
}

function UnauthorizedModal({ open }: Partial<UnauthorizedModalPropsInterface>) {
  const { setOpenUnauthorizedModal } = useContext(AuthContext);
  const handleClick = () => {
    setOpenUnauthorizedModal(false);
  };
  return (
    <Modal open={open}>
      <Typography variant="h5" className="font-medium mb-3 text-center">
        Your session has expired
      </Typography>
      <Button block variant="secondary" onClick={handleClick}>
        Sign In
      </Button>
    </Modal>
  );
}

export default UnauthorizedModal;
