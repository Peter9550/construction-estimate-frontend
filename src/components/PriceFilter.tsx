import "./PriceFilter.css";
import type { FC } from "react";
import { Button, Form } from "react-bootstrap";

interface Props {
  value: number;
  min: number;
  max: number;
  setValue: (value: number) => void;
  onSubmit: () => void;
}

export const PriceFilter: FC<Props> = ({ value, min, max, setValue, onSubmit }) => (
  <div className="priceFilter">
    <div className="priceFilterHead">
      <span>Цена до</span>
      <span className="priceFilterValue">{value} коп.</span>
    </div>
    <Form.Range
      className="priceFilterRange"
      min={min}
      max={max}
      step={1}
      value={value}
      onChange={(event) => setValue(Number(event.target.value))}
    />
    <div className="priceFilterScale">
      <span>{min}</span>
      <span>{max}</span>
    </div>
    <Button className="priceFilterButton" onClick={onSubmit}>
      Найти
    </Button>
  </div>
);
