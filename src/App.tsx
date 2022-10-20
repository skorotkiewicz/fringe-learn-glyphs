import { useState } from "react";

/*

na początku pokazuje 3 nowe litery w celu nauki, po kliknieciu na okay zmienia status z 0 na 1 co pokazuje, ze zostało pokazane
jezeli nie ma juz zadnych nowych liter z statusem 0, zaczynaj odpytywac losowo, poprawna odpowiedz dodaje do statusu +1 a zła odpowiedz odejmuje, wiec jak znów wylądje na zero, to pokazuje ponownie w celu nauki. jezeli uzytkownik kazdą nową literkę odpowie na 5 punktów, to dodaje się dodatkowe 3 nowe litery.

gdy wszystkie literki zostaną dodane, odpowiadaj losowo na kazdą literkę.

*/

const App = () => {
  const stats = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    J: 0,
    K: 0,
    L: 0,
    M: 0,
    N: 0,
    O: 0,
    P: 0,
    Q: 0,
    R: 0,
    S: 0,
    T: 0,
    U: 0,
    V: 0,
    W: 0,
    X: 0,
    Y: 0,
    Z: 0,
  };

  const [start, setStart] = useState(false);
  const [learning, setLearning] = useState({});
  const [added, setAdded] = useState({});
  const [current, setCurrent] = useState([]);
  const [answer, setAnswer] = useState("");
  const [alert, setAlert] = useState(-1);

  const keys = Object.entries(stats); // keys

  const addNew = (howManyNew = 3) => {
    let count = 0;
    const letters = Object.keys(learning); // keys
    if (letters.length > 25) return;

    while (count < howManyNew) {
      const a = keys[Math.floor(Math.random() * keys.length)];

      if (a[1] === 0 && !(a[0] in learning)) {
        setLearning((prev) => ({ ...prev, [a[0]]: 0 }));
        count++;
      }
    }
  };

  const get = () => {
    for (let [key, value] of Object.entries(learning)) {
      if (value === 0) {
        setCurrent([key, value]);
        setLearning((prev) => ({ ...prev, [key]: 1 }));

        break;
      }
    }
  };

  const ans = (key, value) => {
    let a;
    let g = 0;

    const rand = () => {
      const keys = Object.entries(learning);
      a = keys[Math.floor(Math.random() * keys.length)];
    };

    const check = (key, a) => {
      if (answer.toUpperCase() === key) {
        console.log("OK");

        if (
          value === 4 &&
          key === answer.toUpperCase() &&
          !Object.keys(added).includes(key.toLowerCase())
        ) {
          setAdded((prev) => ({ ...prev, [key.toLowerCase()]: true }));
          addNew(1);
        }

        setCurrent([a[0], a[1]]);
        setLearning((prev) => ({ ...prev, [key]: value + 1 }));
      } else {
        if (answer && value !== 0) setAlert(0);

        setTimeout(() => {
          setCurrent([a[0], a[1]]);

          if (answer && value !== 0) {
            setLearning((prev) => ({ ...prev, [key]: Math.max(0, value - 1) }));
          }

          setAlert(-1);
        }, 500);
      }

      setAnswer("");
    };

    rand();

    const letters = Object.keys(learning); // keys
    if (letters.length > 25) {
      return check(key, a);
    }

    while (g < 1) {
      if (a[1] >= 10 || key === a[0]) {
        rand();
      } else {
        g = 1;
        check(key, a);
      }
    }

    console.log(learning);
  };

  const okay = (current, learning) => {
    if (Object.values(learning).includes(0)) {
      get();
    } else {
      ans(current[0], current[1]);
    }
  };

  return (
    <div style={{ backgroundColor: alert === 0 && "red" }}>
      App
      {!start ? (
        <button
          onClick={() => {
            setStart(true);
            addNew();
          }}
        >
          Start
        </button>
      ) : (
        <div>
          {current[1] === 0 && <h1>{current[0]}</h1>}
          <h2>{current[0]}</h2>
          <strong>{current[1]}</strong>

          {current[1] > 0 && (
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") okay(current, learning);
              }}
            />
          )}

          <button
            onClick={() => {
              okay(current, learning);
            }}
          >
            Okay
          </button>
        </div>
      )}
      {JSON.stringify(learning).toString()}
    </div>
  );
};

export default App;
