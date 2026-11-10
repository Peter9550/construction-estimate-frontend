import "./AddPage.css";
import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createConstructionWorkDraft,
  getConstructionWorkDraft,
  publishConstructionWorkDraft,
} from "../slices/constructionWorksSlice";
import { DEFAULT_IMAGE, DEFAULT_VIDEO, mediaUrl } from "../modules/media";

export const AddPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { draft, loading, error } = useAppSelector((state) => state.constructionWorks);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [workName, setWorkName] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [historicalPrice, setHistoricalPrice] = useState("");
  const [baseYear, setBaseYear] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getConstructionWorkDraft());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => () => URL.revokeObjectURL(imagePreview), [imagePreview]);
  useEffect(() => () => URL.revokeObjectURL(videoPreview), [videoPreview]);

  if (!isAuthenticated) {
    return (
      <div className="add">
        <h1 className="addTitle">Добавление работы</h1>
        <p className="addHint">Добавлять работы может только вошедший сметчик.</p>
        <Button className="addSubmit" onClick={() => navigate(ROUTES.LOGIN)}>
          Войти
        </Button>
      </div>
    );
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setVideo(file);
    setVideoPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    if (image && video) {
      dispatch(createConstructionWorkDraft({ work_name: workName, image, video }));
    }
  };

  const handlePublish = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(
      publishConstructionWorkDraft({
        work_description: workDescription,
        historical_price: Number(historicalPrice),
        base_year: Number(baseYear),
      })
    );
    if (publishConstructionWorkDraft.fulfilled.match(result)) {
      navigate(`${ROUTES.FEED}/${result.payload.id}`);
    }
  };

  const imageSrc = draft ? mediaUrl(draft.image_url, DEFAULT_IMAGE) : imagePreview || DEFAULT_IMAGE;
  const videoSrc = draft ? mediaUrl(draft.video_url, DEFAULT_VIDEO) : videoPreview || DEFAULT_VIDEO;

  return (
    <div className="add">
      <div className="addHead">
        <h1 className="addTitle">Добавление работы</h1>
        {draft && <span className="addBadge">{draft.work_status}</span>}
      </div>

      <Form onSubmit={draft ? handlePublish : handleCreate}>
        <p className="addLabel">Фото</p>
        <div className="addMediaBox">
          <img className="addMediaImage" src={imageSrc} alt="Фото работы" />
        </div>
        {!draft && (
          <Form.Control
            className="addFile"
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
          />
        )}

        <p className="addLabel">Видео</p>
        <div className="addMediaBox">
          <video
            key={videoSrc}
            className="addMediaVideo"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        {!draft && (
          <Form.Control
            className="addFile"
            type="file"
            accept="video/*"
            required
            onChange={handleVideoChange}
          />
        )}

        <p className="addLabel">Название</p>
        {draft ? (
          <p className="addValue">{draft.work_name}</p>
        ) : (
          <Form.Control
            className="addField"
            type="text"
            maxLength={100}
            required
            value={workName}
            onChange={(event) => setWorkName(event.target.value)}
          />
        )}

        {draft && (
          <>
            <p className="addLabel">Краткое описание</p>
            <Form.Control
              as="textarea"
              className="addField addArea"
              maxLength={500}
              required
              value={workDescription}
              onChange={(event) => setWorkDescription(event.target.value)}
            />

            <div className="addRow">
              <label className="addColumn">
                <span className="addLabel">Цена, коп.</span>
                <Form.Control
                  className="addField"
                  type="number"
                  min={1}
                  required
                  value={historicalPrice}
                  onChange={(event) => setHistoricalPrice(event.target.value)}
                />
              </label>
              <label className="addColumn">
                <span className="addLabel">Год цены</span>
                <Form.Control
                  className="addField"
                  type="number"
                  min={1000}
                  max={2100}
                  required
                  value={baseYear}
                  onChange={(event) => setBaseYear(event.target.value)}
                />
              </label>
            </div>
          </>
        )}

        {error && <p className="addError">{error}</p>}

        <Button className="addSubmit" type="submit" disabled={loading}>
          {draft ? "Опубликовать" : "Далее"}
        </Button>
      </Form>
    </div>
  );
};
