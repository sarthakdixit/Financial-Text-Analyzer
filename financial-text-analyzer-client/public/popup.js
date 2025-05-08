import React, { useState } from "react";

function Popup() {
  const [selectedText, setSelectedText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [summary, setSummary] = useState("");

  const handleAnalyzeClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getSelectedText" },
        (response) => {
          setSelectedText(response.selectedText);
          if (response.selectedText) {
            chrome.runtime.sendMessage(
              { action: "getSentiment", text: response.selectedText },
              (data) => {
                setSentiment(data.sentiment);
                setSummary(data.summary);
              }
            );
          }
        }
      );
    });
  };

  return (
    <div>
      <h1>Analyze Financial Text</h1>
      <button onClick={handleAnalyzeClick}>Analyze Selected Text</button>
      <p>
        <strong>Selected Text:</strong> {selectedText}
      </p>
      <p>
        <strong>Sentiment:</strong> {sentiment}
      </p>
      <p>
        <strong>Summary:</strong> {summary}
      </p>
    </div>
  );
}

export default Popup;
