import "./WorkCard.css";
import type { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { DEFAULT_IMAGE, mediaUrl } from "../modules/media";

interface Props {
  work_name: string;
  image_url: string;
  historical_price: number | null;
  base_year: number | null;
  likes_count: number;
  onClick: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const WorkCard: FC<Props> = ({
  work_name,
  image_url,
  historical_price,
  base_year,
  likes_count,
  onClick,
  onDelete,
  disabled,
}) => (
  <Card className="workCard" onClick={onClick}>
    <Card.Img
      className="workCardImage"
      variant="top"
      src={mediaUrl(image_url, DEFAULT_IMAGE)}
      alt={work_name}
    />
    <Card.Body className="workCardBody">
      <Card.Title className="workCardName">{work_name}</Card.Title>
      <Card.Text className="workCardPrice">
        {historical_price} коп., {base_year} г.
      </Card.Text>
      <Card.Text className="workCardLikes">&#9829; {likes_count}</Card.Text>
    </Card.Body>
    {onDelete && (
      <Button
        className="workCardDelete"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
      >
        Удалить
      </Button>
    )}
  </Card>
);
