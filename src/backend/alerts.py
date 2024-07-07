import base64
from email.message import EmailMessage
from dotenv import load_dotenv

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

creds : any

def initAlerts() -> None:
    load_dotenv()
    creds, _ = google.auth.default()

def alert(item : dict) -> None:
    if 'alerts' in item:
        for alert in item['alerts']:
            latest_query = item['history'][0]
            tracked_price = latest_query[str(alert['tracking'])]['price']
            if (tracked_price > alert['critical_point'] if alert['greater_than'] else tracked_price < alert['critical_point']) or True:
                try:
                    service = build("gmail", "v1", credentials=creds)
                    message = EmailMessage()

                    message.set_content("An item you had alerts for has reached a critical point. Check it out here: http://localhost/items/" + item['_id'])

                    message["To"] = alert['email']
                    message["From"] = alert['craigslist.tracker@gmail.com']
                    message["Subject"] = "Alert: " + item['name']

                    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

                    create_message = {"raw" : encoded_message}

                    send_message = (
                        service.users()
                         .messages()
                         .send(userId="me", body=create_message)
                         .execute()
                    )
                    print(f'Sent email alert for {item["name"]} with id {send_message["_id"]}')
                except HttpError as error:
                    print(f'Email alert for {item["_id"]} failed with error: {error}')
                    send_message = None
                return send_message