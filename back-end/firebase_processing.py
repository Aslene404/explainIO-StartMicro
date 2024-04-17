import os
import uuid

import firebase_admin
from firebase_admin import credentials, storage
from security_processing import unlock

def save_to_firebase(local_file_path, thumbnail_path, title,host):
    if host == "127.0.0.1":
        client_file="explain-io-firebase.json"
        unlock("firebase.bin",client_file)
        cred = credentials.Certificate(
            client_file)  # Replace with your credentials file path
        explainIO_app=firebase_admin.initialize_app(cred,
                                      {'storageBucket': 'explain-io-temp.appspot.com'}) # Replace with your project ID
        os.remove(client_file)
    else:
        client_file = "/home/explainIO/mysite/explain-io-firebase.json"
        unlock("/home/explainIO/mysite/firebase.bin", client_file)
        cred = credentials.Certificate(
            client_file)  # Replace with your credentials file path
        explainIO_app=firebase_admin.initialize_app(cred,
                                      {'storageBucket': 'explain-io-temp.appspot.com'})  # Replace with your project ID
        os.remove(client_file)
    # Get a reference to the default Firebase Storage bucket
    bucket = storage.bucket()

    # Define local file path and destination file path in Firebase Storage
    unique_id = str(uuid.uuid4())

    destination_blob_name = 'uploads/' + title + '-' + unique_id  # Replace with the desired path in Firebase Storage
    destination_thumbnail_name = 'uploads/' + title + '-' + unique_id + "-thumbnail"
    # Upload the file

    blob = bucket.blob(destination_blob_name)
    blob2 = bucket.blob(destination_thumbnail_name)
    blob2.upload_from_filename(thumbnail_path)
    blob.upload_from_filename(local_file_path, timeout=3000, num_retries=3)

    print(f'File {local_file_path} uploaded to {destination_blob_name} in Firebase Storage.')
    firebase_admin.delete_app(explainIO_app)
    os.remove(local_file_path)
    os.remove(thumbnail_path)
    return destination_blob_name


