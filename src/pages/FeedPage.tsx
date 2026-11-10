import "./FeedPage.css";
import { useEffect, useRef, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import {
  getConstructionWorkFeed,
  likeConstructionWork,
} from "../slices/constructionWorksSlice";
import { DEFAULT_IMAGE, DEFAULT_VIDEO, mediaUrl } from "../modules/media";

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
  const loadedId = useRef<number | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { feedWork: work, loading, error } = useAppSelector(
    (state) => state.constructionWorks
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    const workId = id ? Number(id) : undefined;
    if (workId !== undefined && loadedId.current === workId) {
      loadedId.current = null;
      return;
    }
    dispatch(getConstructionWorkFeed({ work_id: workId }));
  }, [dispatch, id, isAuthenticated]);

  if (!work || (id !== undefined && work.id !== Number(id))) {
    return <div className="feedEmpty">{loading ? "" : error ?? "Работа не найдена"}</div>;
  }

  const [descriptionLess, descriptionMore] = splitDescription(
    work.work_description ?? ""
  );
  const expanded = expandedId === work.id;
  const liked = isAuthenticated && work.is_liked === 1;

  const handleNext = async () => {
    const result = await dispatch(getConstructionWorkFeed({ work_id: work.id, next: true }));
    if (getConstructionWorkFeed.fulfilled.match(result)) {
      loadedId.current = result.payload.id;
      navigate(`${ROUTES.FEED}/${result.payload.id}`);
    }
  };

  const handleLike = () => {
    dispatch(likeConstructionWork({ workId: work.id, like: liked ? 0 : 1 }));
  };

  return (
    <div className="feed">
      <video
        key={work.id}
        className="feedVideo"
        src={mediaUrl(work.video_url, DEFAULT_VIDEO)}
        poster={mediaUrl(work.image_url, DEFAULT_IMAGE)}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="feedShade" />

      <div className="feedOverlay">
        <div className="feedSide">
          <button
            type="button"
            className={`feedAction feedLike ${liked ? "feedLikeActive" : ""}`}
            disabled={!isAuthenticated || loading}
            onClick={handleLike}
          >
            <span className="feedActionCircle">&#9829;</span>
            <span className="feedActionLabel">{work.likes_count}</span>
          </button>

          <div className="feedParam">
            <span className="feedParamLabel">Цена</span>
            <span className="feedParamValue">{work.historical_price} коп.</span>
          </div>

          <div className="feedParam">
            <span className="feedParamLabel">Год цены</span>
            <span className="feedParamValue">{work.base_year}</span>
          </div>

          <Button className="feedAction feedNext" disabled={loading} onClick={handleNext}>
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
