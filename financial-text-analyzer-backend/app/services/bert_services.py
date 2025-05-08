from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoModelForSeq2SeqLM, pipeline
import torch
from concurrent.futures import ThreadPoolExecutor, as_completed

class BERTService:
    def __init__(self, model_dir: str, summarization_model_dir: str):
        self.tokenizer = AutoTokenizer.from_pretrained(model_dir)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_dir,
            torch_dtype=torch.float32
        )
        self.model.eval()
        self.labels = ["negative", "neutral", "positive"]

        self.summarization_tokenizer = AutoTokenizer.from_pretrained(summarization_model_dir)
        self.summarization_model = AutoModelForSeq2SeqLM.from_pretrained(summarization_model_dir)
        self.summarizer = pipeline("summarization", model=self.summarization_model, tokenizer=self.summarization_tokenizer)

    def analyze_text_concurrently(self, text:str):
        result = {}
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_summary = executor.submit(self.summarize_text, text)
            future_sentiment = executor.submit(self.predict_sentiment, text)

            for future in as_completed([future_summary, future_sentiment]):
                if future == future_summary:
                    result['summary'] = future.result()
                elif future == future_sentiment:
                    result['sentiment'] = future.result()
        return result

    def predict_sentiment(self, text: str):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=1).tolist()[0]
        top_index = int(torch.argmax(logits))
        return {
            "label": self.labels[top_index],
            "confidence": probs[top_index],
            "probabilities": dict(zip(self.labels, probs))
        }
    
    def summarize_text(self, text: str):
        word_count = len(text.split())
        min_length = max(20, int(0.1 * word_count))
        max_length = max(40, int(0.5 * word_count))
        summary = self.summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]['summary_text']
