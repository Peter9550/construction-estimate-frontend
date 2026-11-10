import "./CatalogPage.css";
import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { PriceFilter } from "../components/PriceFilter";
import { WorkCard } from "../components/WorkCard";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import {
  deleteConstructionWork,
  getConstructionWorksList,
  setPriceLimit,
} from "../slices/constructionWorksSlice";

const CatalogPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { works, priceLimit, priceMin, priceMax, loading } = useAppSelector(
    (state) => state.constructionWorks
  );
  const { isAuthenticated, user_login } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getConstructionWorksList());
  }, [dispatch, isAuthenticated]);

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.FEED}/${id}`);
  };

  return (
    <div className="catalog">
      <h1 className="catalogTitle">Справочник работ</h1>
      {isAuthenticated && <p className="catalogUser">Сметчик {user_login}</p>}

      <PriceFilter
        value={priceLimit ?? priceMax}
        min={priceMin}
        max={priceMax}
        disabled={loading}
        setValue={(value) => dispatch(setPriceLimit(value))}
        onSubmit={() => dispatch(getConstructionWorksList())}
      />

      {!works.length ? (
        <div className="catalogEmpty">Работ с такой ценой не найдено</div>
      ) : (
        <div className="catalogGrid">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              {...work}
              onClick={() => handleCardClick(work.id)}
              onDelete={
                isAuthenticated && work.is_mine
                  ? () => dispatch(deleteConstructionWork(work.id))
                  : undefined
              }
              disabled={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
