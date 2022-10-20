import { useState } from "react";
import stats from "./utils/stats.json";
import "./main.scss";

const App = () => {
  const [start, setStart] = useState(false);
  const [learning, setLearning] = useState({});
  const [added, setAdded] = useState({});
  const [current, setCurrent]: any = useState([]);
  const [answer, setAnswer] = useState("");
  const [alert, setAlert] = useState(-1);
  const [progress, setProgress] = useState(0);
  let percentage = ((100 * progress) / 260).toFixed(2);

  const keys = Object.entries(stats); // keys

  const save = () => {
    localStorage.setItem(
      "storage",
      JSON.stringify({
        start: start,
        learning: learning,
        added: added,
        current: current,
        progress: progress,
      })
    );
  };

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
        setProgress((prev) => prev + 1);

        break;
      }
    }
  };

  // check answer and get new letter
  const ans = (key: string, value: number) => {
    let a: any;
    let g = 0;

    const rand = () => {
      const keys = Object.entries(learning);
      a = keys[Math.floor(Math.random() * keys.length)];
    };

    const check = (key: string, a: any) => {
      save();

      if (answer.toUpperCase() === key) {
        // console.log("OK");
        setAlert(1);

        if (
          value === 4 &&
          key === answer.toUpperCase() &&
          !Object.keys(added).includes(key.toLowerCase())
        ) {
          setAdded((prev) => ({ ...prev, [key.toLowerCase()]: true }));
          addNew(1);
        }

        setTimeout(() => {
          setCurrent([a[0], a[1]]);
          setLearning((prev) => ({ ...prev, [key]: value + 1 }));
          setProgress((prev) => prev + 1);

          setAlert(-1);
        }, 300);
      } else {
        if (answer && value !== 0) setAlert(0);

        setTimeout(() => {
          setCurrent([a[0], a[1]]);

          if (answer && value !== 0) {
            setLearning((prev) => ({ ...prev, [key]: Math.max(0, value - 1) }));
            setProgress((prev) => Math.max(0, prev - 1));
          }

          setAlert(-1);
        }, 900);
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

  const okay = (current: any, learning: any) => {
    if (Object.values(learning).includes(0)) {
      get();
    } else {
      ans(current[0], current[1]);
    }
  };

  return (
    <div className="container">
      {!start ? (
        <div>
          <button
            onClick={() => {
              setStart(true);
              addNew();
            }}
          >
            Start
          </button>

          {localStorage.getItem("storage") && (
            <button
              onClick={() => {
                const storage: any = localStorage.getItem("storage");
                const data = JSON.parse(storage);

                setStart(data.start);
                setLearning(data.learning);
                setAdded(data.added);
                setCurrent(data.current);
                setProgress(data.progress);
              }}
            >
              Continue
            </button>
          )}
        </div>
      ) : (
        <div className="dialog">
          {current.length === 0 && (
            <div>
              <h4>Intro</h4>
              <p>
                At the beginning the first 3 Glyphs are shown for learning
                purposes, if you answer 5 times correctly for a given Glyph a
                new Glyph is added.
              </p>
            </div>
          )}

          <div className="dialog-content">
            {current[0] && (
              <>
                <img
                  className={`${
                    alert === 0 ? "red" : alert === 1 ? "green" : ""
                  }`}
                  src={"glyphs/" + current[0].toUpperCase() + ".jpg"}
                  alt="glyph"
                />
                {import.meta.env.DEV && <em>({current[0]}) </em>}
                {current[1] === 0 && <h1>{current[0]}</h1>}
              </>
            )}

            {current[1] > 0 && (
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") okay(current, learning);
                }}
                placeholder="What letter is it?"
              />
            )}

            <button
              className={`${current[1] === 0 ? "newLetterBtn" : ""}`}
              onClick={() => {
                okay(current, learning);
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {start && (
        <div className="stats">
          <h3 style={{ letterSpacing: "5pt" }}>
            {learning && Object.keys(learning).toString()}
          </h3>
          {import.meta.env.DEV && JSON.stringify(learning).toString()}

          {Number(percentage) > 100 ? (
            <div>
              <em>Freely repeat all the letters you already know</em>
            </div>
          ) : (
            <div>
              <div className="percentage">
                <progress value={percentage} max="100">
                  {percentage}%
                </progress>
                {percentage}%
              </div>
              <div>
                Level: {Math.max(1, Number(percentage) / 10).toFixed(0)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
