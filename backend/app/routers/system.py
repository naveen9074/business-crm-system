"""
System routes — Web scraping trigger and background jobs.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import requests
from bs4 import BeautifulSoup

from app.database import get_db
from app.models.web_scraping import WebScrapingPreference, ScrapingResult
from app.models.alert import Alert

router = APIRouter(prefix="/api/system", tags=["System"])


@router.post("/scrape")
def trigger_scrape(db: Session = Depends(get_db)):
    """
    Manually trigger web scraping for all active preferences.
    In production, this would be called by a cron job every 6 hours.
    """
    prefs = db.query(WebScrapingPreference).filter(
        WebScrapingPreference.preference_status == "active"
    ).all()

    results_processed = 0
    alerts_created = 0

    for pref in prefs:
        try:
            # Fetch the webpage
            headers = {"User-Agent": "CRM-Bot/1.0"}
            resp = requests.get(pref.website_url, headers=headers, timeout=10)
            resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "lxml")
            page_text = soup.get_text(separator=" ", strip=True)
            page_title = soup.title.string if soup.title else pref.website_url

            # Search for keyword in page content
            keyword_lower = pref.keyword.lower()
            if keyword_lower in page_text.lower():
                # Extract surrounding context (up to 500 chars around keyword)
                idx = page_text.lower().find(keyword_lower)
                start = max(0, idx - 200)
                end = min(len(page_text), idx + len(pref.keyword) + 300)
                extracted = page_text[start:end].strip()

                # Store scraping result
                result = ScrapingResult(
                    preference_id=pref.preference_id,
                    title=page_title[:300] if page_title else "No title",
                    source_url=pref.website_url,
                    extracted_message=extracted,
                    result_status="pending",
                )
                db.add(result)
                db.flush()
                results_processed += 1

                # Create alert
                alert_msg = f"New {pref.category or 'match'} found: {page_title} — {extracted[:200]}"
                alert = Alert(
                    preference_id=pref.preference_id,
                    result_id=result.result_id,
                    message=alert_msg,
                    alert_status="pending",
                    forwarded_to_manager=False,
                )
                db.add(alert)
                alerts_created += 1

        except Exception:
            # Skip failed URLs silently
            continue

    db.commit()
    return {
        "success": True,
        "results_processed": results_processed,
        "alerts_created": alerts_created,
    }
