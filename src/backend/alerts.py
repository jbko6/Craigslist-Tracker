import smtplib
import os
from bson import ObjectId
from dotenv import load_dotenv
from email.mime.text import MIMEText
from pymongo.collection import Collection

smtp_connection : smtplib.SMTP = None

def initAlerts() -> None:
    load_dotenv()

def alert(item : dict, itemDB : Collection, query) -> None:
    if 'alerts' in item:
        for idx, alert in enumerate(item['alerts']):
            tracked_price = query[str(alert['tracking'])]['price']
            if (tracked_price > alert['critical_point'] if alert['greater_than'] else tracked_price < alert['critical_point']):
                #send the email
                smtp_connection = smtplib.SMTP(os.getenv('SMTP_SERVER_URL'), os.getenv('SMTP_PORT'))
                smtp_connection.login(os.getenv('SMTP_USER'), os.getenv('SMTP_PASSWORD'))

                email_body = "The item '" + item['name'] + "' has reached a critical point. Check it out here: http://localhost:5000/item/" + str(item['_id'])
                email_message = MIMEText(email_body)
                email_message['Subject'] = "Alert: " + item['name']
                email_message['From'] = os.getenv('SMTP_SENDER')
                email_message['To'] = alert['email']

                smtp_connection.sendmail(os.getenv('SMTP_SENDER'), alert['email'], email_message.as_string())

                smtp_connection.quit()

                itemDB.update_one({'_id': ObjectId(item['_id'])}, {'$set': {'alerts.' + str(idx) + '.last_alert': query}})

                print('Sent email for ' + item['name'])