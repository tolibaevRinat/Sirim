import { useState } from "react";
import "./App.css";
import test1 from "./data/test1.json";
import test2 from "./data/test2.json";
import test3 from "./data/test3.json";

const TESTS = {
  "abdimuratova gozzal": test1,
  "ibrgagimova feruza": test2,
  "jaqsilikov atabek": test3,
};

const TEST_TITLES = {
  test1: "Informatika fanidan testlar",
  test2: "Rus tilidan testlar",
  test3: "Ingliz tilidan testlar",
};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleTest(test) {
  const shuffled = shuffle(test.questions).map((q) => {
    const order = shuffle([0, 1, 2, 3]);
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      correctIndex: order.indexOf(q.correctIndex),
    };
  });
  return { ...test, questions: shuffled };
}

function Brand() {
  return (
    <div className="brand">
      <img
        src="/NMPI-logo-photoaidcom-cropped.jpg"
        alt="NMPI Logo"
        className="brand-logo"
      />
      <h1 className="brand-title">
        Pedagoglarning kasbiy malakasini davlat baholash markazi
      </h1>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("start");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [currentTest, setCurrentTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [percent, setPercent] = useState(0);

  const handleStart = () => setScreen("login");

  const handleLogin = (e) => {
    e.preventDefault();
    const key = name.trim().toLowerCase();
    const test = TESTS[key];
    if (test) {
      setCurrentTest(shuffleTest(test));
      setAnswers({});
      setScreen("test");
      setError("");
      window.scrollTo(0, 0);
    } else {
      setError("Ism mos kelmadi");
    }
  };

  const selectAnswer = (qid, idx) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const computeResult = () => {
    const total = currentTest.questions.length;
    let correct = 0;
    for (const q of currentTest.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    setPercent(Math.round((correct / total) * 100));
    setShowConfirm(false);
    setScreen("result");
    window.scrollTo(0, 0);
  };

  const finishTest = () => {
    const total = currentTest.questions.length;
    const answered = Object.keys(answers).length;
    if (answered < total) {
      setShowConfirm(true);
    } else {
      computeResult();
    }
  };

  if (screen === "start") {
    return (
      <main className="screen">
        <Brand />
        <button
          type="button"
          className="pill pill-button"
          onClick={handleStart}
        >
          Testni boshlash
        </button>
      </main>
    );
  }

  if (screen === "login") {
    return (
      <main className="screen">
        <Brand />
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            className={"pill pill-input" + (error ? " has-error" : "")}
            placeholder="Ism Familiya"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="pill pill-button">
            Kirish
          </button>
        </form>
      </main>
    );
  }

  if (screen === "test") {
    const total = currentTest.questions.length;
    const answered = Object.keys(answers).length;
    return (
      <main className="test-screen">
        <div className="test-counter">
          <span className="counter-label">Belgilangan: </span>
          {answered} / {total}
        </div>

        <header className="test-header">
          <h1 className="test-title">{TEST_TITLES[currentTest.id]}</h1>
        </header>

        <div className="test-questions">
          {currentTest.questions.map((q, qIndex) => (
            <div key={q.id} className="question-card">
              <p className="question-text">
                <span className="question-num">{qIndex + 1}.</span> {q.question}
              </p>
              <div className="options">
                {q.options.map((opt, i) => {
                  const isSelected = answers[q.id] === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={
                        "pill option-pill" + (isSelected ? " is-selected" : "")
                      }
                      onClick={() => selectAnswer(q.id, i)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="pill pill-button finish-button"
          onClick={finishTest}
        >
          Tugatish
        </button>

        {showConfirm && (
          <div
            className="modal-backdrop"
            onClick={() => setShowConfirm(false)}
            role="presentation"
          >
            <div
              className="modal-card"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="modal-text">
                Siz hamma savollarga javob bermadingiz. Testni
                yakunlamoqchimisiz?
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="pill pill-button"
                  onClick={computeResult}
                >
                  Ha
                </button>
                <button
                  type="button"
                  className="pill pill-button"
                  onClick={() => setShowConfirm(false)}
                >
                  Yoʻq
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  if (screen === "result") {
    const handleRetry = () => {
      setName("");
      setError("");
      setAnswers({});
      setCurrentTest(null);
      setPercent(0);
      setScreen("login");
    };

    return (
      <main className="screen">
        <div className="result">
          <p className="result-label">Natija</p>
          <p className="result-percent">{percent}%</p>
          <button
            type="button"
            className="pill pill-button retry-button"
            onClick={handleRetry}
          >
            Bosh saxifa
          </button>
        </div>
      </main>
    );
  }

  return null;
}

export default App;
