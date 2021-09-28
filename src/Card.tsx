import React from "react";
import classnames from "classnames";
import frontimg from "./images/frontimg.png";
import "./Card.scss";

interface CardProps{
  onClick(index:number):void,
  card:{type:string, image:JSX.Element },
  index:number,
  isInactive: boolean,
  isFlipped: boolean
}


const Card:React.FC<CardProps> = (props) => {
  const handleClick = () => {
    !props.isFlipped && props.onClick(props.index);
  };

  return (
    <div
      className={classnames("card", {
        "is-flipped": props.isFlipped,
        "is-inactive": props.isInactive
      })}
      onClick={handleClick}
    >
      <div className="card-face card-font-face">
        <img src={frontimg} alt="frontimage" />
      </div>
      <div className="card-face card-back-face">
        {props.card.image}
       </div>
    </div>
  );
};

export default Card;
