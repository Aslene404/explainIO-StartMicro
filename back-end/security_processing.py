from cryptography.fernet import Fernet
import json


def unlock(bin_file, json_file):
    cipher_suite = Fernet("g8tYRlvP0iGKitE7OfkvirLZhIKo6SY-ABMlk7r_grc=")

    # Read the encrypted data from the file
    with open(bin_file, 'rb') as file:
        encrypted_data = file.read()

    # Decrypt the data
    decrypted_data = cipher_suite.decrypt(encrypted_data)

    # Convert bytes back to JSON
    decrypted_json_data = json.loads(decrypted_data.decode())
    with open(json_file, 'w') as json_file:
        json.dump(decrypted_json_data, json_file, indent=2)
def lock():
    # Your JSON data
    json_data = {
        "keys": [
            "key_placeholder",
        ],
        # ... (your JSON data here)
    }

    # Convert JSON data to bytes
    json_bytes = json.dumps(json_data).encode()

    # Encrypt the data
    cipher_suite = Fernet("g8tYRlvP0iGKitE7OfkvirLZhIKo6SY-ABMlk7r_grc=")
    encrypted_data = cipher_suite.encrypt(json_bytes)

    # Save the encrypted data to a file
    with open('openai.bin', 'wb') as file:
        file.write(encrypted_data)

    # Read the encrypted data from the file
    with open('openai.bin', 'rb') as file:
        encrypted_data = file.read()

    # Decrypt the data
    decrypted_data = cipher_suite.decrypt(encrypted_data)

    # Convert bytes back to JSON
    decrypted_json_data = json.loads(decrypted_data.decode())
    with open("json_file.json", 'w') as json_file:
        json.dump(decrypted_json_data, json_file, indent=2)
    print(decrypted_json_data)