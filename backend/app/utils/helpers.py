def score_text_relevance(text: str, keywords: list) -> float:
    hit_count = sum(1 for k in keywords if k.lower() in text.lower())
    return min(100.0, hit_count * 25.0)

def build_ai_prompt(task: str, data: dict) -> str:
    if task == "content":
        return f"Generate a 3D-rich, SEO-optimized article on: {data['topic']} including {', '.join(data['keywords'])}"
    elif task == "summary":
        return f"Summarize this site: {data['url']}"
    return "Unknown AI prompt."
