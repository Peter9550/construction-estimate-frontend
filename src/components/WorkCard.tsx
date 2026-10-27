import "./WorkCard.css";
import type { FC } from "react";
import { Card } from "react-bootstrap";

const defaultImage = "/DefaultImage.png";

interface Props {
  work_name: string;
  image_url: string;
  historical_price: number | null;
  base_year: number | null;
  likes_count: number;
  onClick: () => void;
}

export const WorkCard: FC<Props> = ({
  work_name,
  image_url,
  historical_price,
  base_year,
  likes_count,
  onClick,
}) => (
  <Card className="workCard" onClick={onClick}>
    <Card.Img
      className="workCardImage"
      variant="top"
      src={image_url || defaultImage}
      alt={work_name}
    />
    <Card.Body className="workCardBody">
      <Card.Title className="workCardName">{work_name}</Card.Title>
      <Card.Text className="workCardPrice">
        {historical_price} коп., {base_year} г.
      </Card.Text>
      <Card.Text className="workCardLikes">&#9829; {likes_count}</Card.Text>
    </Card.Body>
  </Card>
);
