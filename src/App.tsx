import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle
} from "@material-ui/core";
import Card from "./Card";
import "./App.scss";
import alien from "./images/alien.png"
import clown from "./images/clown.png"
import cyclop from "./images/cyclop.png"
import dracula from "./images/dracula.png"
import medusa from "./images/medusa.png"
import monster from "./images/monster.png"
import mummy from "./images/mummy.png"
import ninja from "./images/ninja.png"
import pirate from "./images/pirate.png"
import robot from "./images/robot.png"
import viking from "./images/viking.png"
import wizard from "./images/wizard.png"
import middleimg from "./images/middleimg.jpg"



const uniqueCardsArray: { type: string, image: JSX.Element }[] = [
  {
    type: "Alien",
    image: <img src={alien} alt="alien" />
  },
  {
    type: "Clown",
    image: <img src={clown} alt="clown" />
  },
  {
    type: "Cyclop",
    image: <img src={cyclop} alt="cyclop" />
  },
  {
    type: "Dracula",
    image: <img src={dracula} alt="dracula" />
  },
  {
    type: "Medusa",
    image: <img src={medusa} alt="medusa" />
  },
  {
    type: "Monster",
    image: <img src={monster} alt="monster" />
  },
  {
    type: "Mummy",
    image: <img src={mummy} alt="mummy" />
  },
  {
    type: "Ninja",
    image: <img src={ninja} alt="ninja" />
  },
  {
    type: "Pirate",
    image: <img src={pirate} alt="pirate" />
  },
  {
    type: "Robot",
    image: <img src={robot} alt="robot" />
  },
  {
    type: "Viking",
    image: <img src={viking} alt="viking" />
  },
  {
    type: "Wizard",
    image: <img src={wizard} alt="wizard" />
  }
];
const middleCard: { type: string, image: JSX.Element } =
{
  type: "middle",
  image: <img src={middleimg} alt="middle" />
};

// Перемешиваные карт
function shuffleCards(array: { type: string, image: JSX.Element }[]) {
  const newArray = array.concat(array);
  const length = newArray.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temp;
  }
  // Вставляем центральную карту
  newArray.splice(12, 0, middleCard);
  return newArray;
}
export default function App() {
  const [cards, setCards] = useState(() => shuffleCards(uniqueCardsArray));
  const [openCards, setOpenCards] = useState<number[]>([]);
  const [completeCards, setCompleteCards] = useState<number[]>([12]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  let timeCounter = useRef<NodeJS.Timeout>();
  let timeout = useRef<NodeJS.Timeout>();


  //Таймер
  const startTimer = () => {
    clearInterval(Number(timeCounter.current))
    timeCounter.current = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000);
  }

  // Обработчик клика по карточке
  const handleCardClick = (index: number) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
    } else {
      clearTimeout(Number(timeout.current))
      setOpenCards([index]);
    }
  };

// Проверяем, совпали ли карты
  useEffect(() => {
    const evaluate = () => {
      const [first, second] = openCards;
      if (cards[first].type === cards[second].type) {
        setCurrentStreak(prev => prev += 1);
        setCompleteCards(prev => [...prev, first, second]);
        setOpenCards([]);
      } else {
        setCurrentStreak(0)
      }
      // Автоматический переворот карт
      timeout.current = setTimeout(() => {
        setOpenCards([]);
      }, 500);
    }
    if (openCards.length === 2) {
      timeout.current = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(Number(timeout.current))
    }
  }, [openCards, cards]);


  useEffect(() => {
    startTimer()
  }, []);

  // Проверяем, завершена ли игра
  useEffect(() => {
    const checkCompletion = () => {
      if (completeCards.length === cards.length) {
        setShowModal(true);
        clearInterval(Number(timeCounter.current))
      }
    }
    checkCompletion();
  }, [completeCards, cards]);

  //Подсчет лучшей серии
  useEffect(() => {
    if (currentStreak > bestStreak) {
      setBestStreak(currentStreak)
    };
  }, [currentStreak, bestStreak])

  // Оставляем угаданные и выбранные карточки перевернутыми
  const checkIsFlipped = (index: number) => {
    return (openCards.includes(index) || completeCards.includes(index));
  };
  // Подсветка для угаданных карт
  const checkIsInactive = (index: number) => {
    return completeCards.includes(index);
  };
  // Рестарт
  const handleRestart = () => {
    setCompleteCards([12]);
    setOpenCards([]);
    setShowModal(false);
    setCurrentStreak(0);
    setBestStreak(0);
    setCount(0);
    startTimer();
    setCards(shuffleCards(uniqueCardsArray));
  };

  return (
    <div className="App">
      <header>
        <h3>Memory Game</h3>
        <div className="score">
          <div className="moves">
            <span className="bold">Timer:{count}</span> { }
          </div>
        </div>
        <div className="restart">
          <Button onClick={handleRestart} color="primary" variant="contained">
            Restart
          </Button>
        </div>
      </header>
      <div className="container">
        {cards.map((card, index) => {
          return (
            <Card
              key={index}
              card={card}
              index={index}
              isInactive={checkIsInactive(index)}
              isFlipped={checkIsFlipped(index)}
              onClick={handleCardClick}
            />
          );
        })}
      </div>
      
      <Dialog
        open={showModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          CONGRATULATIONS!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You completed the game in {count} seconds. Best streak {bestStreak}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestart} color="primary">
            Restart
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
