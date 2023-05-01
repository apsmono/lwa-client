import React, { ReactNode } from "react";
import * as t from "prop-types";
import Button from "../Button";
import { Edit2, Eye, Trash2 } from "react-feather";

interface TableControlPropsInterface {
  onViewClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  customButton: ReactNode;
}

function TableControl(props: Partial<TableControlPropsInterface>) {
  const { onViewClick, onEditClick, onDeleteClick, customButton } = props;
  return (
    <div className="flex gap-2">
      {customButton && customButton}
      {!!onViewClick && (
        <Button
          variant="link"
          className="px-0 py-0 text-black"
          title="View"
          onClick={onViewClick}
        >
          <Eye size={18} />
        </Button>
      )}
      {!!onEditClick && (
        <Button
          variant="link"
          className="px-0 py-0 text-black"
          title="Edit"
          onClick={onEditClick}
        >
          <Edit2 size={18} />
        </Button>
      )}
      {!!onDeleteClick && (
        <Button
          variant="link"
          className="px-0 py-0 text-black"
          title="Delete"
          onClick={onDeleteClick}
        >
          <Trash2 size={18} />
        </Button>
      )}
    </div>
  );
}
TableControl.propTypes = {
  onViewClick: t.func,
  onEditClick: t.func,
  onDeleteClick: t.func,
  customButton: t.node,
};

export default TableControl;
