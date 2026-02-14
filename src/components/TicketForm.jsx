import React, { useState } from "react";
import { buyTicket } from "../utils/contractInteraction";

export const TicketForm = ({ signer, isOpen, onSuccess, onError }) => {
  const [numbers, setNumbers] = useState(Array(7).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNumberChange = (index, value) => {
    const num = parseInt(value) || "";
    if (num === "" || (num >= 1 && num <= 47)) {
      const newNumbers = [...numbers];
      newNumbers[index] = num;
      setNumbers(newNumbers);
    }
  };

  const isFormValid = numbers.every((n) => n > 0 && n <= 47) && numbers.length === 7;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      onError("Please enter all 7 numbers between 1 and 47");
      return;
    }

    setIsSubmitting(true);

    try {
      const numArray = numbers.map((n) => parseInt(n));
      await buyTicket(signer, numArray);
      setNumbers(Array(7).fill(""));
      onSuccess("Ticket purchased successfully!");
    } catch (error) {
      onError(error.message || "Failed to purchase ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="ticket-form disabled">
        <p>Lottery is currently closed. Wait for the next round.</p>
      </div>
    );
  }

  return (
    <div className="ticket-form">
      <h2>Buy a Ticket</h2>
      <p className="form-description">Select 7 different numbers between 1 and 47</p>

      <form onSubmit={handleSubmit}>
        <div className="numbers-input">
          {numbers.map((num, idx) => (
            <input
              key={idx}
              type="number"
              min="1"
              max="47"
              value={num}
              onChange={(e) => handleNumberChange(idx, e.target.value)}
              placeholder={`#${idx + 1}`}
              disabled={isSubmitting}
            />
          ))}
        </div>

        <div className="selected-numbers">
          <p>Selected: {numbers.filter((n) => n).join(", ") || "None"}</p>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting || !signer}
          className="submit-btn"
        >
          {isSubmitting ? "Processing..." : "Buy Ticket"}
        </button>
      </form>
    </div>
  );
};
