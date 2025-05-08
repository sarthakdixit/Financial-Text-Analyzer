from fastapi import APIRouter
from app.schemas import AnalyzeRequest
from app.services.bert_services import BERTService

router = APIRouter()
bert_service = BERTService(model_dir="app/models/sentiment-bert-model", summarization_model_dir="app/models/summary-bert-model")

@router.post("/text-processing")
def analyze_api(req: AnalyzeRequest):
    result = bert_service.analyze_text_concurrently(req.text)
    return result