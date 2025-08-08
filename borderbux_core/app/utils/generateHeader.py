import json
import base64
import hmac
import hashlib
import time

def generate_payload_and_signature(secret, body):
    # Generate timestamp in milliseconds (same as JavaScript's Date.now())
    timestamp = str(int(time.time() * 1000))
    print(body)
    # Create the payload object (same as JavaScript)
    obj = {
        'body': body,
        'timestamp': timestamp
    }
    print(obj)
    
    # Convert the object to a JSON string
    json_obj = json.dumps(obj)
    # Base64 encode the JSON string
    payload = base64.b64encode(json_obj.encode('utf-8')).decode('utf-8')
    signature = hmac.new(secret.encode('utf-8'), payload.encode('utf-8'), hashlib.sha512).hexdigest()
    
    return {"payload": payload, "signature": signature}