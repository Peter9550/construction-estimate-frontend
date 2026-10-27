import "./CatalogPage.css";
import { useEffect, useState, type FC } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CONSTRUCTION_WORKS_MOCK } from "../modules/mock";
import { PriceFilter } from "../components/PriceFilter";
import { WorkCard } from "../components/WorkCard";
import { ROUTES } from "../Routes";
import type { AppOutletContext } from "../AppLayout";

const prices = CONSTRUCTION_WORKS_MOCK.map((work) => work.historical_price ?? 0);
const priceMin = Math.min(...prices);
const priceMax = Math.max(...prices);

const CatalogPage: FC = () => {
  const [priceLimit, setPriceLimit] = useState(priceMax);
  const [works, setWorks] = useState(CONSTRUCTION_WORKS_MOCK);
  const { setCards } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();

  useEffect(() => {
    setCards(CONSTRUCTION_WORKS_MOCK);
  }, [setCards]);

  const handleSearch = () => {
    const results = CONSTRUCTION_WORKS_MOCK.filter(
      (work) => (work.historical_price ?? 0) <= priceLimit
    );
    setWorks(results);
    setCards(results);
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.FEED}/${id}`);
  };

  return (
    <div className="catalog">
      <h1 className="catalogTitle">Справочник работ</h1>

      <PriceFilter
        value={priceLimit}
        min={priceMin}
        max={priceMax}
        setValue={(value) => setPriceLimit(value)}
        onSubmit={handleSearch}
      />

      {!works.length ? (
        <div className="catalogEmpty">Работ с такой ценой не найдено</div>
      ) : (
        <div className="catalogGrid">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              onClick={() => handleCardClick(work.id)}
              {...work}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
