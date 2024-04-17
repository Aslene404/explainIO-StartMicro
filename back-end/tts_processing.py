import os

from google.oauth2 import service_account
from google.cloud import texttospeech
from security_processing import unlock
from openai import OpenAI


# client_file = 'explain-io-ab5b46de3371.json'
# credentials = service_account.Credentials.from_service_account_file(client_file)


def synthesize_text(text, output_file, voice, host, lang_code):
    if host == "127.0.0.1":
        client_file = 'explain-io-gcloud.json'
        unlock("gcloud.bin", client_file)
        credentials = service_account.Credentials.from_service_account_file(client_file)
        os.remove(client_file)
    else:
        client_file = '/home/explainIO/mysite/explain-io-gcloud.json'
        unlock("/home/explainIO/mysite/gcloud.bin", client_file)
        credentials = service_account.Credentials.from_service_account_file(client_file)
        os.remove(client_file)
    if text == "":
        if lang_code == "en-US":
            text = "I understand"
        elif lang_code == "ar-XA":
            text = "لقد فهمتك"
        elif lang_code == "fr-FR":
            text = "J'ai compris"
        else:
            text = "Ich verstehe"
    client = texttospeech.TextToSpeechClient(credentials=credentials)
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=lang_code,
        name=voice
    )
    audio_config = texttospeech.AudioConfig(
        speaking_rate=0.95,
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )

    response = client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )

    with open(output_file, "wb") as out_file:
        out_file.write(response.audio_content)


def synthesize_text_openai(text, output_file, voice, key,lang_code):
    if text == "":
        if lang_code == "en-US":
            text = "I understand"
        elif lang_code == "ar-XA":
            text = "لقد فهمتك"
        elif lang_code == "fr-FR":
            text = "J'ai compris"
        else:
            text = "Ich verstehe"
    client = OpenAI(api_key=key)

    # ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
    response = client.audio.speech.create(
        model="tts-1-hd",
        voice=voice,
        input=text)
    response.stream_to_file(output_file)
# "Wasser ist eine chemische Verbindung, die aus den Elementen Wasserstoff und Sauerstoff besteht. "
#                    "Es ist lebenswichtig für alle Lebewesen auf der Erde und kommt in verschiedenen Formen wie "
#                    "flüssig, fest (Eis) und gasförmig (Wasserdampf) vor.Feuer ist eine chemische Reaktion, "
#                    "bei der Sauerstoff mit einem brennbaren Stoff reagiert. Dabei entstehen Wärme, Licht und "
#                    "verschiedene Gase."
# "Das Wort Gras bezieht sich auf grüne Vegetation, die typischerweise den Boden in Rasenflächen, "
#                    "Wiesen und Feldern bedeckt. Es ist eine weit verbreitete Pflanze in vielen Teilen der Welt und "
#                    "wird oft als Futter für weidende Tiere wie Kühe und Schafe verwendet."
# text = "Hallo, wie geht es dir? Ich bin eine der vielen Stimmen, die in dieser tollen App enthalten sind"
# output_file = "assets/voices/maja_voice.mp3"
# conrad="de-DE-Neural2-B" | kasper="de-DE-Standard-E" | elke="de-DE-Neural2-F" | klarissa="de-DE-Neural2-C" |
# bernd="de-DE-Polyglot-1" | maja = "de-DE-Wavenet-C"
# synthesize_text(text, output_file, "de-DE-Wavenet-C")
