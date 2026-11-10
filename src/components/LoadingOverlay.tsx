import "./LoadingOverlay.css";
import type { FC } from "react";
import { Spinner } from "react-bootstrap";

export const LoadingOverlay: FC = () => (
  <div className="loadingOverlay">
    <Spinner className="loadingOverlaySpinner" animation="border" />
  </div>
);
