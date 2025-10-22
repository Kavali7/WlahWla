import urllib.parse

def click_to_chat_link(phone_number: str, text: str) -> str:
    # Returns a wa.me link; phone should be in international format without '+'
    enc = urllib.parse.quote(text)
    return f"https://wa.me/{phone_number}?text={enc}"

# Placeholder for WhatsApp Business Cloud API (sending messages requires Meta App and tokens).
def send_order_via_whatsapp_cloud_api(phone_number_id: str, access_token: str, to_number: str, text: str):
    # Implement with requests.post to https://graph.facebook.com/v19.0/{phone_number_id}/messages
    # headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    # data = {"messaging_product": "whatsapp", "to": to_number, "type": "text", "text": {"body": text}}
    # requests.post(url, json=data, headers=headers)
    pass
