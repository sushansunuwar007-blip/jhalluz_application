export default function QuizCard({ question, onSelect, current, total }) {
  return (
    <div className="quiz-container">
      <div className="q-header">QUESTION {current} / {total}</div>
      <h3 className="q-text">{question.q}</h3>
      <div className="options">
        {question.options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => onSelect(i)}>{opt}</button>
        ))}
      </div>
    </div>
  );
}