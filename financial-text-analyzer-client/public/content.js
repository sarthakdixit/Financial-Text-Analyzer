chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeText") {
    let selectedText = message.text;

    let updatePopup = injectPopup("Loading...", "Fetching results...");

    analyzeText(selectedText)
      .then((result) => {
        updatePopup(result);
      })
      .catch((error) => {
        console.error("Error:", error);
        updatePopup({
          label: "Error",
          summary: "An error occurred during analysis.",
        });
      });

    return true;
  }
});

async function analyzeText(selectedText) {
  try {
    let response = await fetch("http://localhost:8000/api/v1/text-processing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: selectedText }),
    });

    if (!response.ok) {
      console.error("Error analyzing text:", response.statusText);
      throw new Error("Error analyzing text");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function injectPopup() {
  const popup = document.createElement("div");
  popup.setAttribute("id", "custom-popup");

  const sentimentElem = document.createElement("p");
  sentimentElem.setAttribute("id", "sentiment");
  sentimentElem.textContent = `Sentiment: Loading...`;
  popup.appendChild(sentimentElem);

  const summaryElem = document.createElement("p");
  summaryElem.setAttribute("id", "summary");
  summaryElem.textContent = `Summary: Loading...`;
  popup.appendChild(summaryElem);

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  popup.appendChild(spinner);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    popup.remove();
  });
  popup.appendChild(closeButton);

  document.addEventListener("click", (event) => {
    if (
      !popup.contains(event.target) &&
      event.target !== document.getElementById("close-btn")
    ) {
      popup.style.display = "none";
    }
  });

  document.body.appendChild(popup);

  function updatePopup(result) {
    sentimentElem.classList.remove("positive", "neutral", "negative");

    document.getElementById(
      "sentiment"
    ).textContent = `Sentiment: ${result.sentiment.label}`;
    document.getElementById(
      "summary"
    ).textContent = `Summary: ${result.summary || "No summary available"}`;

    spinner.style.display = "none";

    switch (result.sentiment.label.toLowerCase()) {
      case "positive":
        sentimentElem.classList.add("positive");
        break;
      case "neutral":
        sentimentElem.classList.add("neutral");
        break;
      case "negative":
        sentimentElem.classList.add("negative");
        break;
    }
  }

  return updatePopup;
}
