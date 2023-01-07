import React, { useState } from "react";

function AppleComponent() {
  function TooManyDisplay() {
    if (numOfApples > 10) {
      return <h1>Negar has too many apples</h1>;
    } else {
      return <h1></h1>;
    }
  }
  const [numOfApples, setNumOfApples] = useState(0);
  function AppleDisplay() {
    if (numOfApples === 0 || numOfApples === 1) {
      return `negar has ${numOfApples} apple`;
    } else if (numOfApples > 1) {
      return `negar has ${numOfApples} apples`;
    } else {
      return `negar owes me ${Math.abs(numOfApples)} apples`;
    }
  }
  return (
    <>
      <div>
        <h1>{AppleDisplay(numOfApples)}</h1>
      </div>
      <button
        onClick={() => setNumOfApples((currentValue) => currentValue + 1)}
        className="add-btn"
      >
        Increase
      </button>
      <button
        style={{ display: numOfApples <= 0 ? "none" : "" }}
        onClick={() => setNumOfApples((currentValue) => currentValue - 1)}
        className="min-btn"
      >
        Decrease
      </button>
      <TooManyDisplay />
    </>
  );
}

export default AppleComponent;
