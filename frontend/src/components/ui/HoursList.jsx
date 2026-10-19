import { HORARIOS } from "../../utils/schedule.js";
import "./HoursList.css";

function HoursList({ compact = false }) {
  return (
    <dl className={`hours-list${compact ? " hours-list--compact" : ""}`}>
      {HORARIOS.map((item) => (
        <div className="hours-list__row" key={item.dias}>
          <dt>{item.dias}</dt>
          <dd>{item.horario}</dd>
        </div>
      ))}
    </dl>
  );
}

export default HoursList;
