import "./FeedPage.css";
import { useState, type FC } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CONSTRUCTION_WORKS_MOCK } from "../modules/mock";
import { ROUTES } from "../Routes";
import type { AppOutletContext } from "../AppLayout";

const defaultImage = "/DefaultImage.png";
const defaultVideo = "/DefaultVideo.mp4";
const DESCRIPTION_LESS_LENGTH = 70;

const splitDescription = (description: string) => {
  if (description.length <= DESCRIPTION_LESS_LENGTH) {
    return [description, ""];
  }
  const space = description.lastIndexOf(" ", DESCRIPTION_LESS_LENGTH - 1);
  const cut = space === -1 ? DESCRIPTION_LESS_LENGTH : space;
  return [description.slice(0, cut), description.slice(cut)];
};

export const FeedPage: FC = () => {
  const [expandedId, setExpandedId] = useState<number>();
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useOutletContext<AppOutletContext>();

  const work =
    cards.find((item) => String(item.id) === id) ??
    CONSTRUCTION_WORKS_MOCK.find((item) => String(item.id) === id);

  if (!work) {
    return <div className="feedEmpty">Работа не найдена</div>;
  }

  const [descriptionLess, descriptionMore] = splitDescription(
    work.work_description ?? ""
  );
  const expanded = expandedId === work.id;

  const handleNext = () => {
    const currentIndex = cards.findIndex((item) => item.id === work.id);
    const nextItem = cards[currentIndex + 1] ?? cards[0];
    if (nextItem) {
      navigate(`${ROUTES.FEED}/${nextItem.id}`);
    }
  };

  return (
    <div className="feed">
      <video
        className="feedVideo"
        src={work.video_url || defaultVideo}
        poster={work.image_url || defaultImage}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="feedShade" />

      <div className="feedOverlay">
        <div className="feedSide">
          <div className="feedAction">
            <span className="feedActionCircle">&#9829;</span>
            <span className="feedActionLabel">{work.likes_count}</span>
          </div>

          <div className="feedParam">
            <span className="feedParamLabel">Цена</span>
            <span className="feedParamValue">{work.historical_price} коп.</span>
          </div>

          <div className="feedParam">
            <span className="feedParamLabel">Год цены</span>
            <span className="feedParamValue">{work.base_year}</span>
          </div>

          <Button className="feedAction feedNext" onClick={handleNext}>
            <span className="feedActionCircle">&#9660;</span>
            <span className="feedActionLabel">Следующий</span>
          </Button>
        </div>

        <div className="feedInfo">
          <h1 className="feedName">{work.work_name}</h1>
          <p
            className={`feedDescription ${descriptionMore ? "feedDescriptionMore" : ""}`}
            onClick={() => setExpandedId(work.id)}
          >
            {descriptionLess}
            {descriptionMore && !expanded && (
              <span className="feedMore">... ещё</span>
            )}
            {expanded && descriptionMore}
          </p>
        </div>
      </div>
    </div>
  );
};
