import { useState } from "react";
import stats from "./utils/stats.json";

const App = () => {
  const [start, setStart] = useState(false);
  const [learning, setLearning] = useState({});
  const [added, setAdded] = useState({});
  const [current, setCurrent] = useState([]);
  const [answer, setAnswer] = useState("");
  const [alert, setAlert] = useState(-1);

  const keys = Object.entries(stats); // keys

  // Add new letter to learning object store
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

  // get letter for learning
  const get = () => {
    for (let [key, value] of Object.entries(learning)) {
      if (value === 0) {
        setCurrent([key, value]);
        setLearning((prev) => ({ ...prev, [key]: 1 }));

        break;
      }
    }
  };

  // check answer and get new letter
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

          {current[0] && (
            <div>
              <img
                src={"glyphs/" + current[0].toLowerCase() + ".jpg"}
                style={{ width: 100 }}
                alt="glyph"
              />
              <em>({current[0]}) </em>
            </div>
          )}

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
      <h3 style={{ letterSpacing: "5pt" }}>
        {Object.keys(learning).toString()}
      </h3>
      {JSON.stringify(learning).toString()}
    </div>
  );
};

export default App;
