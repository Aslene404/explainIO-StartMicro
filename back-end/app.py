import json
import platform
import random
import subprocess
import time

import PyPDF2
from flask_cors import CORS
from flask import Flask, jsonify, request
import os

from werkzeug.utils import secure_filename

from tts_processing import synthesize_text, synthesize_text_openai
from text_processing import split_conversation, remove_empty_lines, has_duplicates, remove_duplicates, \
    estimate_tts_time_dual, estimate_tts_time_mono, reduce_to_tokens
from video_processing import crop_video_bottm_right, crop_video_bottm_left, stick_videos_side_by_side, release_video, \
    add_logo, generate_thumbnail, get_audio_duration, stick_videos_mono, generate_thumbnail_podcast, combine_mp3_files, \
    add_podcast_effects
from ai_processing import new_call_language_model, google_call_language_model
import uuid
from firebase_processing import save_to_firebase
import psutil
import GPUtil
from security_processing import unlock
from pdf_processing import bookmark_dict

app = Flask(__name__)
CORS(app)
# Configure upload folder
ALLOWED_EXTENSIONS = {'pdf'}


class Progress:
    def __init__(self, operation, percentage):
        self.operation = operation
        self.percentage = percentage


def delete_file_if_unused(file_path):
    try:
        # Try to delete the file
        os.remove(file_path)
        print(f"File {file_path} deleted successfully.")
    except OSError as e:
        # If the file is in use, handle the exception
        print(f"Unable to delete {file_path}. File in use or does not exist. Error: {e}")


def delete_all_assets(directory):
    files = os.listdir(directory)

    # Filter and delete MP3 files
    for asset_file in files:
        if asset_file.endswith(".mp3"):
            file_path = os.path.join(current_directory, asset_file)
            delete_file_if_unused(file_path)
        if asset_file.endswith(".png"):
            file_path = os.path.join(current_directory, asset_file)
            delete_file_if_unused(file_path)
        if asset_file.endswith(".mp4"):
            file_path = os.path.join(current_directory, asset_file)
            delete_file_if_unused(file_path)
        if asset_file.endswith(".jpg"):
            file_path = os.path.join(current_directory, asset_file)
            delete_file_if_unused(file_path)


# Get the current directory
current_directory = os.getcwd()
delete_all_assets(current_directory)

# List all files in the current directory
pronunciation_dict = {
    'A': 'ay',
    'B': 'bee',
    'C': 'cee',
    'D': 'dee',
    'E': 'i',
    'F': 'f',
    'G': 'jee',
    'H': 'aysh',
    'I': 'eye',
    'J': 'jay',
    'K': 'kay',
    'L': 'el',
    'M': 'm',
    'N': 'n',
    'O': 'oh',
    'P': 'pee',
    'Q': 'cue',
    'R': 'ar',
    'S': 'ess',
    'T': 'tee',
    'U': 'you',
    'V': 'vee',
    'W': 'dable you',
    'X': 'ecks',
    'Y': 'why',
    'Z': 'ze',
}
abbreviation = {
    "IT": " ".join([pronunciation_dict[char] for char in "IT"]),  # Information Technology
    "ID": " ".join([pronunciation_dict[char] for char in "ID"]),  # Identification
    "CEO": " ".join([pronunciation_dict[char] for char in "CEO"]),  # Chief Executive Officer
    "CFO": " ".join([pronunciation_dict[char] for char in "CFO"]),  # Chief Financial Officer
    "CTO": " ".join([pronunciation_dict[char] for char in "CTO"]),  # Chief Technology Officer
    "FAQ": " ".join([pronunciation_dict[char] for char in "FAQ"]),  # Frequently Asked Questions
    "GPS": " ".join([pronunciation_dict[char] for char in "GPS"]),  # Global Positioning System
    "URL": " ".join([pronunciation_dict[char] for char in "URL"]),  # Uniform Resource Locator
    "LAN": " ".join([pronunciation_dict[char] for char in "LAN"]),  # Local Area Network
    "WLAN": " ".join([pronunciation_dict[char] for char in "WLAN"]),  # Wireless Local Area Network
    "AI": " ".join([pronunciation_dict[char] for char in "AI"]),  # Artificial Intelligence
    "HTML": " ".join([pronunciation_dict[char] for char in "HTML"]),  # Hypertext Markup Language
    "CSS": " ".join([pronunciation_dict[char] for char in "CSS"]),  # Cascading Style Sheets
    "HTTP": " ".join([pronunciation_dict[char] for char in "HTTP"]),  # Hypertext Transfer Protocol
    "HTTPS": " ".join([pronunciation_dict[char] for char in "HTTPS"]),  # Hypertext Transfer Protocol Secure
    "SMTP": " ".join([pronunciation_dict[char] for char in "SMTP"]),  # Simple Mail Transfer Protocol
    "PDF": " ".join([pronunciation_dict[char] for char in "PDF"]),  # Portable Document Format
    "JPEG": " ".join([pronunciation_dict[char] for char in "JPEG"]),  # Joint Photographic Experts Group
    "USB": " ".join([pronunciation_dict[char] for char in "USB"]),  # Universal Serial Bus
    "LCD": " ".join([pronunciation_dict[char] for char in "LCD"]),  # Liquid Crystal Display
    "LED": " ".join([pronunciation_dict[char] for char in "LED"]),  # Light Emitting Diode
    "RAM": " ".join([pronunciation_dict[char] for char in "RAM"]),  # Random Access Memory
    "CPU": " ".join([pronunciation_dict[char] for char in "CPU"]),  # Central Processing Unit
    "GPU": " ".join([pronunciation_dict[char] for char in "GPU"]),  # Graphics Processing Unit
    "DNS": " ".join([pronunciation_dict[char] for char in "DNS"]),  # Domain Name System
    "FTP": " ".join([pronunciation_dict[char] for char in "FTP"]),  # File Transfer Protocol
    "VPN": " ".join([pronunciation_dict[char] for char in "VPN"]),  # Virtual Private Network
    "SSD": " ".join([pronunciation_dict[char] for char in "SSD"]),  # Solid State Drive
    "HDD": " ".join([pronunciation_dict[char] for char in "HDD"]),  # Hard Disk Drive
    "ISP": " ".join([pronunciation_dict[char] for char in "ISP"]),  # Internet Service Provider
    "OS": " ".join([pronunciation_dict[char] for char in "OS"]),  # Operating System
    "SSL": " ".join([pronunciation_dict[char] for char in "SSL"]),  # Secure Sockets Layer
    "TLS": " ".join([pronunciation_dict[char] for char in "TLS"]),  # Transport Layer Security
    "HTML5": " ".join([pronunciation_dict[char] for char in "HTML"]),  # Hypertext Markup Language version 5
    "API": " ".join([pronunciation_dict[char] for char in "API"]),  # Application Programming Interface
    "SDK": " ".join([pronunciation_dict[char] for char in "SDK"]),  # Software Development Kit
    "URL": " ".join([pronunciation_dict[char] for char in "URL"]),  # Uniform Resource Locator
    "IoT": " ".join([pronunciation_dict[char] for char in "IOT"]),  # Internet of Things
    "VoIP": " ".join([pronunciation_dict[char] for char in "VOIP"]),  # Voice over Internet Protocol
    "XML": " ".join([pronunciation_dict[char] for char in "XML"]),  # eXtensible Markup Language
    "JSON": " ".join([pronunciation_dict[char] for char in "JSON"]),  # JavaScript Object Notation
    "SQL": " ".join([pronunciation_dict[char] for char in "SQL"]),  # Structured Query Language
    "SaaS": " ".join([pronunciation_dict[char] for char in "SAAS"]),  # Software as a Service
    "PaaS": " ".join([pronunciation_dict[char] for char in "PAAS"]),  # Platform as a Service
    "IaaS": " ".join([pronunciation_dict[char] for char in "IAAS"]),  # Infrastructure as a Service
    "RFID": " ".join([pronunciation_dict[char] for char in "RFID"]),  # Radio-Frequency Identification
    "NFC": " ".join([pronunciation_dict[char] for char in "NFC"]),  # Near Field Communication
    "BI": " ".join([pronunciation_dict[char] for char in "BI"]),  # Business Intelligence
    "CRM": " ".join([pronunciation_dict[char] for char in "CRM"]),  # Customer Relationship Management
    "ERP": " ".join([pronunciation_dict[char] for char in "ERP"]),  # Enterprise Resource Planning
    "API": " ".join([pronunciation_dict[char] for char in "API"]),  # Application Programming Interface
    "DNS": " ".join([pronunciation_dict[char] for char in "DNS"]),  # Domain Name System
    "SDK": " ".join([pronunciation_dict[char] for char in "SDK"]),  # Software Development Kit
    "UX": " ".join([pronunciation_dict[char] for char in "UX"]),  # User Experience
    "UI": " ".join([pronunciation_dict[char] for char in "UI"]),  # User Interface
    "CMS": " ".join([pronunciation_dict[char] for char in "CMS"]),  # Content Management System
    "MVP": " ".join([pronunciation_dict[char] for char in "MVP"]),  # Minimum Viable Product
    "QA": " ".join([pronunciation_dict[char] for char in "QA"]),  # Quality Assurance
    "IoT": " ".join([pronunciation_dict[char] for char in "IOT"]),  # Internet of Things
    "AR": " ".join([pronunciation_dict[char] for char in "AR"]),  # Augmented Reality
    "VR": " ".join([pronunciation_dict[char] for char in "VR"]),  # Virtual Reality
    "MR": " ".join([pronunciation_dict[char] for char in "MR"]),  # Mixed Reality
    "GDPR": " ".join([pronunciation_dict[char] for char in "GDPR"]),  # General Data Protection Regulation
}

open_ai_pronunciation_dict = {
    'A': 'ay',
    'B': 'bee',
    'C': 'see',
    'D': 'dee',
    'E': 'ee',
    'F': 'eff',
    'G': 'jee',
    'H': 'aysh',
    'I': 'eye',
    'J': 'jay',
    'K': 'kay',
    'L': 'el',
    'M': 'em',
    'N': 'n',
    'O': 'oh',
    'P': 'pee',
    'Q': 'cue',
    'R': 'ar',
    'S': 'ess',
    'T': 'tee',
    'U': 'you',
    'V': 'vee',
    'W': 'dable you',
    'X': 'ecks',
    'Y': 'why',
    'Z': 'zee',
}
open_ai_abbreviation = {
    "IT": " ".join([open_ai_pronunciation_dict[char] for char in "IT"]),  # Information Technology
    "ID": " ".join([open_ai_pronunciation_dict[char] for char in "ID"]),  # Identification
    "CEO": " ".join([open_ai_pronunciation_dict[char] for char in "CEO"]),  # Chief Executive Officer
    "CFO": " ".join([open_ai_pronunciation_dict[char] for char in "CFO"]),  # Chief Financial Officer
    "CTO": " ".join([open_ai_pronunciation_dict[char] for char in "CTO"]),  # Chief Technology Officer
    "FAQ": " ".join([open_ai_pronunciation_dict[char] for char in "FAQ"]),  # Frequently Asked Questions
    "GPS": " ".join([open_ai_pronunciation_dict[char] for char in "GPS"]),  # Global Positioning System
    "URL": " ".join([open_ai_pronunciation_dict[char] for char in "URL"]),  # Uniform Resource Locator
    "LAN": " ".join([open_ai_pronunciation_dict[char] for char in "LAN"]),  # Local Area Network
    "WLAN": " ".join([open_ai_pronunciation_dict[char] for char in "WLAN"]),  # Wireless Local Area Network
    "AI": " ".join([open_ai_pronunciation_dict[char] for char in "AI"]),  # Artificial Intelligence
    "HTML": " ".join([open_ai_pronunciation_dict[char] for char in "HTML"]),  # Hypertext Markup Language
    "CSS": " ".join([open_ai_pronunciation_dict[char] for char in "CSS"]),  # Cascading Style Sheets
    "HTTP": " ".join([open_ai_pronunciation_dict[char] for char in "HTTP"]),  # Hypertext Transfer Protocol
    "HTTPS": " ".join([open_ai_pronunciation_dict[char] for char in "HTTPS"]),  # Hypertext Transfer Protocol Secure
    "SMTP": " ".join([open_ai_pronunciation_dict[char] for char in "SMTP"]),  # Simple Mail Transfer Protocol
    "PDF": " ".join([open_ai_pronunciation_dict[char] for char in "PDF"]),  # Portable Document Format
    "JPEG": " ".join([open_ai_pronunciation_dict[char] for char in "JPEG"]),  # Joint Photographic Experts Group
    "USB": " ".join([open_ai_pronunciation_dict[char] for char in "USB"]),  # Universal Serial Bus
    "LCD": " ".join([open_ai_pronunciation_dict[char] for char in "LCD"]),  # Liquid Crystal Display
    "LED": " ".join([open_ai_pronunciation_dict[char] for char in "LED"]),  # Light Emitting Diode
    "RAM": " ".join([open_ai_pronunciation_dict[char] for char in "RAM"]),  # Random Access Memory
    "CPU": " ".join([open_ai_pronunciation_dict[char] for char in "CPU"]),  # Central Processing Unit
    "GPU": " ".join([open_ai_pronunciation_dict[char] for char in "GPU"]),  # Graphics Processing Unit
    "DNS": " ".join([open_ai_pronunciation_dict[char] for char in "DNS"]),  # Domain Name System
    "FTP": " ".join([open_ai_pronunciation_dict[char] for char in "FTP"]),  # File Transfer Protocol
    "VPN": " ".join([open_ai_pronunciation_dict[char] for char in "VPN"]),  # Virtual Private Network
    "SSD": " ".join([open_ai_pronunciation_dict[char] for char in "SSD"]),  # Solid State Drive
    "HDD": " ".join([open_ai_pronunciation_dict[char] for char in "HDD"]),  # Hard Disk Drive
    "ISP": " ".join([open_ai_pronunciation_dict[char] for char in "ISP"]),  # Internet Service Provider
    "OS": " ".join([open_ai_pronunciation_dict[char] for char in "OS"]),  # Operating System
    "SSL": " ".join([open_ai_pronunciation_dict[char] for char in "SSL"]),  # Secure Sockets Layer
    "TLS": " ".join([open_ai_pronunciation_dict[char] for char in "TLS"]),  # Transport Layer Security
    "HTML5": " ".join([open_ai_pronunciation_dict[char] for char in "HTML"]),  # Hypertext Markup Language version 5
    "API": " ".join([open_ai_pronunciation_dict[char] for char in "API"]),  # Application Programming Interface
    "SDK": " ".join([open_ai_pronunciation_dict[char] for char in "SDK"]),  # Software Development Kit
    "URL": " ".join([open_ai_pronunciation_dict[char] for char in "URL"]),  # Uniform Resource Locator
    "IoT": " ".join([open_ai_pronunciation_dict[char] for char in "IOT"]),  # Internet of Things
    "VoIP": " ".join([open_ai_pronunciation_dict[char] for char in "VOIP"]),  # Voice over Internet Protocol
    "XML": " ".join([open_ai_pronunciation_dict[char] for char in "XML"]),  # eXtensible Markup Language
    "JSON": " ".join([open_ai_pronunciation_dict[char] for char in "JSON"]),  # JavaScript Object Notation
    "SQL": " ".join([open_ai_pronunciation_dict[char] for char in "SQL"]),  # Structured Query Language
    "SaaS": " ".join([open_ai_pronunciation_dict[char] for char in "SAAS"]),  # Software as a Service
    "PaaS": " ".join([open_ai_pronunciation_dict[char] for char in "PAAS"]),  # Platform as a Service
    "IaaS": " ".join([open_ai_pronunciation_dict[char] for char in "IAAS"]),  # Infrastructure as a Service
    "RFID": " ".join([open_ai_pronunciation_dict[char] for char in "RFID"]),  # Radio-Frequency Identification
    "NFC": " ".join([open_ai_pronunciation_dict[char] for char in "NFC"]),  # Near Field Communication
    "BI": " ".join([open_ai_pronunciation_dict[char] for char in "BI"]),  # Business Intelligence
    "CRM": " ".join([open_ai_pronunciation_dict[char] for char in "CRM"]),  # Customer Relationship Management
    "ERP": " ".join([open_ai_pronunciation_dict[char] for char in "ERP"]),  # Enterprise Resource Planning
    "API": " ".join([open_ai_pronunciation_dict[char] for char in "API"]),  # Application Programming Interface
    "DNS": " ".join([open_ai_pronunciation_dict[char] for char in "DNS"]),  # Domain Name System
    "SDK": " ".join([open_ai_pronunciation_dict[char] for char in "SDK"]),  # Software Development Kit
    "UX": " ".join([open_ai_pronunciation_dict[char] for char in "UX"]),  # User Experience
    "UI": " ".join([open_ai_pronunciation_dict[char] for char in "UI"]),  # User Interface
    "CMS": " ".join([open_ai_pronunciation_dict[char] for char in "CMS"]),  # Content Management System
    "MVP": " ".join([open_ai_pronunciation_dict[char] for char in "MVP"]),  # Minimum Viable Product
    "QA": " ".join([open_ai_pronunciation_dict[char] for char in "QA"]),  # Quality Assurance
    "IoT": " ".join([open_ai_pronunciation_dict[char] for char in "IOT"]),  # Internet of Things
    "AR": " ".join([open_ai_pronunciation_dict[char] for char in "AR"]),  # Augmented Reality
    "VR": " ".join([open_ai_pronunciation_dict[char] for char in "VR"]),  # Virtual Reality
    "MR": " ".join([open_ai_pronunciation_dict[char] for char in "MR"]),  # Mixed Reality
    "GDPR": " ".join([open_ai_pronunciation_dict[char] for char in "GDPR"]),  # General Data Protection Regulation
}

german_numbers = {
    1: "eins",
    2: "zwei",
    3: "drei",
    4: "vier",
    5: "fünf",
    6: "sechs",
    7: "sieben",
    8: "acht",
    9: "neun",
    10: "zehn",
    11: "elf",
    12: "zwölf",
    13: "dreizehn",
    14: "vierzehn",
    15: "fünfzehn",
    16: "sechzehn",
    17: "siebzehn",
    18: "achtzehn",
    19: "neunzehn",
    20: "zwanzig"
}
spacy_lang={
"fr-FR":"fr_core_news_sm",
"de-DE":"de_core_news_sm",
"en-US":"en_core_web_sm",
"ar-XA":"xx_ent_wiki_sm",
}
avatars = {
    "Maximilian": "av_1",
    "Lukas": "av_2",
    "Marie": "av_3",
    "Clara": "av_4",
    "Felix": "av_5",
    "Sofia": "av_6",
}  # avatars.get("Maximilian") returns av_1
backgrounds = {
    "ClassrKlassenzimmeroom": "classroom",
    "Modernes Büro": "modern",
    "Büro": "office",
    "Garten": "playground",
}
sfx = {
    "classroom": "school.mp3",
    "modern": "modern_office.mp3",
    "office": "office.mp3",
    "playground": "garden.mp3",
}
voices = {
    "Bernd_de-DE": "de-DE-Polyglot-1",
    "Conrad_de-DE": "de-DE-Neural2-B",
    "Elke_de-DE": "de-DE-Neural2-F",
    "Klarissa_de-DE": "de-DE-Neural2-C",
    "Maja_de-DE": "de-DE-Neural2-A",
    "Kasper_de-DE": "de-DE-Wavenet-E",
    "Elke_0_de-DE": "de-DE-Studio-C",

    "Bernd_en-US": "en-US-Journey-D",
    "Conrad_en-US": "en-US-Neural2-D",
    "Elke_en-US": "de-DE-Neural2-F",
    "Klarissa_en-US": "en-US-Journey-F",
    "Maja_en-US": "en-US-Neural2-C",
    "Kasper_en-US": "en-US-Neural2-I",
    "Elke_0_en-US": "en-US-Studio-O",

    "Bernd_ar-XA": "ar-XA-Standard-C",
    "Conrad_ar-XA": "ar-XA-Standard-B",
    "Elke_ar-XA": "ar-XA-Standard-A",
    "Klarissa_ar-XA": "ar-XA-Standard-D",
    "Maja_ar-XA": "ar-XA-Wavenet-D",
    "Kasper_ar-XA": "ar-XA-Wavenet-C",

    "Bernd_fr-FR": "fr-FR-Neural2-B",
    "Conrad_fr-FR": "fr-FR-Neural2-D",
    "Elke_fr-FR": "fr-FR-Neural2-E",
    "Klarissa_fr-FR": "fr-FR-Neural2-A",
    "Maja_fr-FR": "fr-FR-Studio-A",
    "Kasper_fr-FR": "fr-FR-Studio-D",
    "Elke_0_fr-FR": "fr-FR-Neural2-C",

}  # "Kasper": "de-DE-Standard-E","Maja": "de-DE-Wavenet-C",
openai_voices = {
    "fable": "fable",
    "Conrad_0_de-DE": "alloy",
    "Bernd_0_de-DE": "echo",
    "Kasper_0_de-DE": "onyx",
    "Klarissa_0_de-DE": "nova",
    "Maja_0_de-DE": "shimmer",

    "Conrad_0_en-US": "alloy",
    "Bernd_0_en-US": "echo",
    "Kasper_0_en-US": "onyx",
    "Klarissa_0_en-US": "nova",
    "Maja_0_en-US": "shimmer",

    "Conrad_0_fr-FR": "alloy",
    "Bernd_0_fr-FR": "echo",
    "Kasper_0_fr-FR": "onyx",
    "Klarissa_0_fr-FR": "nova",
    "Maja_0_fr-FR": "shimmer",

}
current_progress = Progress("", "")
global_file_name = ""
try:
    unlock("openai.bin", "keys.json")
except:
    unlock("/home/explainIO/mysite/openai.bin", "keys.json")
with open("keys.json", 'r') as file:
    data = json.load(file)
os.remove("keys.json")
keys = data['keys']
keys_len = len(keys)

current_index = random.randint(0, keys_len - 1)

try:
    unlock("genai.bin", "keys_g.json")
except:
    unlock("/home/explainIO/mysite/genai.bin", "keys_g.json")
with open("keys_g.json", 'r') as file:
    data = json.load(file)
os.remove("keys_g.json")
keys_g = data['keys']
keys_g_len = len(keys_g)
# print(google_call_language_model("what is water ?",keys_g[0]))


@app.route('/')
def display_server():
    host = request.host.split(':')[0].strip()  # Get the host (hostname or IP address)

    return f"The server is running at {host}"


def get_integrated_gpu_info():
    try:
        system_info = platform.system()
        if system_info == 'Linux':
            # Run the lshw command to get detailed hardware information
            result = subprocess.run(['lshw', '-C', 'display', '-json'], capture_output=True, text=True)
            if result.returncode == 0:
                # Parse the JSON output to extract GPU information
                display_info = result.stdout.strip()
                return {'Integrated GPU Information': display_info}
            else:
                return {'Error': result.stderr.strip()}
    except Exception as e:
        return {'Error': str(e)}


@app.route('/api/hello')
def hello_world():
    system_info = {
        'System': platform.system(),
        'Node': platform.node(),
        'Release': platform.release(),
        'Version': platform.version(),
        'Machine': platform.machine(),
        'Processor': platform.processor(),
    }

    cpu_info = {
        'CPU Cores': psutil.cpu_count(logical=False),
        'Logical CPUs': psutil.cpu_count(logical=True),
        'CPU Usage (%)': psutil.cpu_percent(interval=1),
    }

    memory_info = {
        'Total Memory (GB)': round(psutil.virtual_memory().total / (1024 ** 3), 2),
        'Available Memory (GB)': round(psutil.virtual_memory().available / (1024 ** 3), 2),
    }

    try:
        gpu_list = GPUtil.getGPUs()
        gpu_info = [{'GPU {}:'.format(i + 1): {'Name': gpu.name, 'Memory Total (GB)': gpu.memoryTotal,
                                               'Memory Free (GB)': gpu.memoryFree}} for i, gpu in enumerate(gpu_list)]
    except Exception as e:
        gpu_info = {'Error': str(e)}
    integrated_gpu_info = get_integrated_gpu_info()

    hardware_specs = {
        'System Information': system_info,
        'CPU Information': cpu_info,
        'Memory Information': memory_info,
        'GPU Information': gpu_info,
        'Integrated GPU Information': integrated_gpu_info,
    }

    return jsonify(hardware_specs)


@app.route('/api/create_video', methods=['POST'])
def create_video():
    global current_progress
    current_progress = Progress("Initiieren...", "0%")

    global current_index
    host = request.host.split(':')[0].strip()  # Get the host (hostname or IP address)

    request_data = request.get_json()
    backgroundImage = request_data.get('backgroundImage')
    sceneName = request_data.get('sceneName')
    imageLeft = request_data.get('imageLeft')
    imageRight = request_data.get('imageRight')
    conversation = request_data.get('conversation')  # this is an array, scenarios[content] for each entry
    title = request_data.get('title')

    position = request_data.get('position')
    lang_code = request_data.get('lang_code')
    voice1 = request_data.get('voice1') + "_" + lang_code
    voice2 = request_data.get('voice2') + "_" + lang_code
    all_vids = []

    subtitles = []

    audio_paths = []

    conv = split_conversation(remove_empty_lines(conversation))
    backgroundImage = backgrounds[backgroundImage]
    try:
        voice1 = voices[voice1]
    except:
        voice1 = openai_voices[voice1]
    try:
        voice2 = voices[voice2]
    except:
        voice2 = openai_voices[voice2]
    if host == "127.0.0.1":
        cropped_video_bottm_right = 'assets/' + backgroundImage + '/' + avatars[imageLeft] + '_l' + '.mp4'
        cropped_video_bottm_left = 'assets/' + backgroundImage + '/' + avatars[imageRight] + '_r' + '.mp4'
    else:
        cropped_video_bottm_right = '/home/explainIO/mysite/assets/' + backgroundImage + '/' + avatars[
            imageLeft] + '_l' + '.mp4'
        cropped_video_bottm_left = '/home/explainIO/mysite/assets/' + backgroundImage + '/' + avatars[
            imageRight] + '_r' + '.mp4'
    print("Generating Conversation...")
    current_progress = Progress("Themen zusammenfassend...", "20%")
    if lang_code == "fr-FR":
        prompt = f"""
                    Résumez le sujet de cette conversation, en francais, en quelques puces avec « - » et un maximum de trois mots par ligne:
                   
                   """
    elif lang_code == "en-US":
        prompt = f"""
                            Summarize the topic of this conversation, in english, in a few bullet points with “-” and a maximum of three words per line:
                           
                           """
    elif lang_code == "ar-XA":
        prompt = f"""
                                    لخص موضوع هذه المحادثة,  باللغة العربية, في بضع نقاط باستخدام "-" وبحد أقصى ثلاث كلمات في كل سطر:
                                   
                                   """

    else:
        prompt = f"""
            Fassen Sie das Thema dieser Konversation, auf Deutsch, in wenigen Aufzählungspunkten mit „-“ und maximal drei Wörtern pro Zeile zusammen:
           
           """
    while True:
        current_key = keys[current_index]
        print(current_key)
        try:
            keyword = new_call_language_model(prompt, current_key)
            break
        except Exception as e:
            print(e)
            print(f"An exception occurred. Moving to the next key.")
            break

        current_index = (current_index + 1) % keys_len

    current_progress = Progress("Audio erzeugen...", "40%")

    for pair in conv:
        temp_keyword1 = ""
        temp_keyword2 = ""

        print(pair.personA)
        # if keyword in pair.personA:
        #     temp_keyword1 = "has_keyword"
        # if keyword in pair.personB:
        #     temp_keyword2 = "has_keyword"

        unique_id1 = str(uuid.uuid4())
        unique_id2 = str(uuid.uuid4())
        if host == "127.0.0.1":
            audio1_output = unique_id1 + temp_keyword1 + "_output.mp3"
            audio2_output = unique_id2 + temp_keyword2 + "_output.mp3"
        else:
            audio1_output = "/home/explainIO/mysite/" + unique_id1 + temp_keyword1 + "_output.mp3"
            audio2_output = "/home/explainIO/mysite/" + unique_id2 + temp_keyword2 + "_output.mp3"
        audio_paths.append(audio1_output)
        audio_paths.append(audio2_output)
        try:
            for key, value in abbreviation.items():
                pair.personA = pair.personA.replace(key, value)
            synthesize_text(pair.personA, audio1_output, voice1, host, lang_code)
        except:
            while True:
                current_key = keys[current_index]
                print(current_key)
                try:
                    for key, value in open_ai_abbreviation.items():
                        pair.personA = pair.personA.replace(key, value)
                    synthesize_text_openai(pair.personA, audio1_output, voice1, current_key, lang_code)
                    break
                except Exception as e:
                    print(e)
                    print(f"An exception occurred. Moving to the next key.")

                current_index = (current_index + 1) % keys_len

        print(pair.personB)
        try:
            for key, value in abbreviation.items():
                pair.personB = pair.personB.replace(key, value)
            synthesize_text(pair.personB, audio2_output, voice2, host, lang_code)
        except:
            while True:
                current_key = keys[current_index]
                print(current_key)
                try:
                    for key, value in open_ai_abbreviation.items():
                        pair.personB = pair.personB.replace(key, value)
                    synthesize_text_openai(pair.personB, audio2_output, voice2, current_key, lang_code)
                    break
                except Exception as e:
                    print(e)
                    print(f"An exception occurred. Moving to the next key.")

                current_index = (current_index + 1) % keys_len

        print()
        duration1 = get_audio_duration(audio1_output)
        duration2 = get_audio_duration(audio2_output)
        sentence1 = pair.personA
        sentence2 = pair.personB
        if sentence1 != "":
            subtitles.append({"sentence": sentence1, "duration": duration1})
        if sentence2 != "":
            subtitles.append({"sentence": sentence2, "duration": duration2})

        video_chunk = stick_videos_side_by_side(cropped_video_bottm_right, cropped_video_bottm_left, audio1_output,
                                                audio2_output, "output_file.mp4", host, keyword)
        all_vids.append(video_chunk)
    current_progress = Progress("Video erzeugen...", "60%")
    prototype = release_video(cropped_video_bottm_right, cropped_video_bottm_left, all_vids, "output_file.mp4",
                              position, backgroundImage, host)

    start_time = time.time()

    if host == "127.0.0.1":
        temp_path = "temp_output_file" + str(uuid.uuid4()) + ".mp4"
        path = "output_file" + str(uuid.uuid4()) + ".mp4"

        add_logo(prototype, title, temp_path, path, "text_image" + str(uuid.uuid4()) + ".png", host,
                 cropped_video_bottm_right,
                 cropped_video_bottm_left, keyword, sfx=sfx[backgroundImage], lang_code=lang_code)
        thumbnail_path = "thumbnail" + str(uuid.uuid4()) + ".jpg"
        generate_thumbnail(path, thumbnail_path)
    else:
        temp_path = "/home/explainIO/mysite/temp_output_file" + str(uuid.uuid4()) + ".mp4"
        path = "/home/explainIO/mysite/output_file" + str(uuid.uuid4()) + ".mp4"
        add_logo(prototype, title, temp_path, path, "/home/explainIO/mysite/text_image" + str(uuid.uuid4()) + ".png",
                 host,
                 cropped_video_bottm_right,
                 cropped_video_bottm_left, keyword, sfx=sfx[backgroundImage], lang_code=lang_code)
        thumbnail_path = "/home/explainIO/mysite/thumbnail" + str(uuid.uuid4()) + ".jpg"
        generate_thumbnail(path, thumbnail_path)

    end_time = time.time()
    duration = end_time - start_time
    print(f"The writing took {duration} seconds.")

    for my_path in audio_paths:
        delete_file_if_unused(my_path)

    print("Uploading To Firebase...")
    current_progress = Progress("Hochladen in die Datenbank...", "80%")

    if host == "127.0.0.1":
        file_name = save_to_firebase(path, thumbnail_path, "dual_" + title, host)
    else:
        file_name = save_to_firebase(path, thumbnail_path, "dual_" + title, host)

    global global_file_name
    global_file_name = file_name

    delete_file_if_unused(path)
    current_progress = Progress("Erledigt !", "100%")
    return jsonify(file_name=file_name, subtitles=subtitles,
                   speakerNames=[imageLeft, imageRight], title=title, sceneName=sceneName)


@app.route('/api/create_conversation_fast', methods=['POST'])
def create_conversation_fast():
    global current_index
    global keys_len
    current_index = random.randint(0, keys_len - 1)
    request_data = request.get_json()

    imageLeft = request_data.get('speaker1')
    imageRight = request_data.get('speaker2')
    scenarios = request_data.get('scenarios')  # this is an array, scenarios[content] for each entry
    sceneName = request_data.get('sceneName')
    lang_code = request_data.get('lang_code')
    multiline_input = '\n'.join(scenario['content'] for scenario in scenarios)
    if lang_code == "en-US":
        prompt = f"""
        a short conversation with interesting events and stories, in english, between two people on this topic:
        
        """
    elif lang_code == "fr-FR":
        prompt = f"""
        une courte conversation avec des événements et des histoires intéressantes, en français, entre deux personnes sur ce sujet:
        
        """
    elif lang_code == "ar-XA":
        prompt = f"""
        محادثة قصيرة بأحداث وقصص مثيرة للاهتمام, باللغة العربية, بين شخصين حول هذا الموضوع:
        
        """
    else:
        prompt = f"""
        ein kurzes Gespräch mit interessanten Ereignissen und Geschichten, auf Deutsch, zwischen zwei Personen zu diesem Thema:
        
        """
    multiline_input = reduce_to_tokens(multiline_input, spacy_lang.get(lang_code))
    prompt = prompt + multiline_input
    prompt = remove_empty_lines(prompt)
    while True:
        current_key = keys[current_index]
        print(current_key)
        try:
            conversation = new_call_language_model(prompt, current_key)
            break
        except Exception as e:
            print(e)
            print(f"An exception occurred. Moving to the next key.")
            break

        current_index = (current_index + 1) % keys_len
    conversation = remove_empty_lines(conversation)
    names = [imageLeft, imageRight]
    num_names = len(names)
    final_conv = ""
    lines = conversation.strip().split('\n')

    for i, line in enumerate(lines):
        if ":" in line:
            name, content = line.split(':', 1)
        else:
            content = line
        new_name = names[i % num_names]
        new_line = f"{new_name}:{content}"
        final_conv += new_line.strip() + '\n'

    return jsonify(conversation=final_conv, title=scenarios[0]['title'], sceneName=sceneName)


# @app.route('/api/create_conversation_podcast', methods=['POST'])
# def create_conversation_podcast():
#     global current_index
#     global keys_len
#     current_index = random.randint(0, keys_len - 1)
#     request_data = request.get_json()
#
#     imageLeft = request_data.get('speaker1')
#     imageRight = request_data.get('speaker2')
#     scenarios = request_data.get('scenarios')  # this is an array, scenarios[content] for each entry
#     sceneName = request_data.get('sceneName')
#
#     multiline_input = '\n'.join(scenario['content'] for scenario in scenarios)
#
#     prompt = f"""
#     ein kurzes Radio-Podcast-Gespräch auf Deutsch zwischen zwei namenlosen Personen zu diesem Thema:
#
#     """
#     multiline_input = reduce_to_tokens(multiline_input, spacy_lang.get(lang_code))
#     prompt = prompt + multiline_input
#     prompt = remove_empty_lines(prompt)
#     while True:
#         current_key = keys[current_index]
#         print(current_key)
#         try:
#             conversation = new_call_language_model(prompt, current_key)
#             break
#         except Exception as e:
#             print(e)
#             print(f"An exception occurred. Moving to the next key.")
#             break
#
#         current_index = (current_index + 1) % keys_len
#     conversation = remove_empty_lines(conversation)
#     names = [imageLeft, imageRight]
#     num_names = len(names)
#     final_conv = ""
#     lines = conversation.strip().split('\n')
#
#     for i, line in enumerate(lines):
#         if ":" in line:
#             name, content = line.split(':', 1)
#         else:
#             content = line
#         new_name = names[i % num_names]
#         new_line = f"{new_name}:{content}"
#         final_conv += new_line.strip() + '\n'
#
#     return jsonify(conversation=final_conv, title=scenarios[0]['title'], sceneName=sceneName)


@app.route('/api/create_questions_fast', methods=['POST'])
def create_questions_fast():
    isTimedOut = False
    start_time = time.time()
    global current_index
    global keys_len
    current_index = random.randint(0, keys_len - 1)
    request_data = request.get_json()
    sc_count = request_data.get('sc_count')
    mc_count = request_data.get('mc_count')
    wf_count = request_data.get('wf_count')
    lang_code = request_data.get('lang_code')
    scenarios = request_data.get('scenarios')  # this is an array, scenarios[content] for each entry

    multiline_input = '\n'.join(scenario['content'] for scenario in scenarios)

    # {german_numbers.get(questionNumber, questionNumber)}
    if lang_code == "en-US":
        prompt = f"""
                Your task is to create a knowledge test that consists of a certain number of questions based on a text. The text provides the “context” for formulating the questions.
         There are three different question types:
         - Type “SC”:
         - - Formulate the question in such a way that there can only be one correct answer.
         - - Create 4 answer options so that in the end only 1 out of 4 is correct and 3 out of 4 are always wrong. Under no circumstances should more than 1 answer be correct. Please write at the end of each answer whether it is right or wrong.
         - Type “MC”:
         - - Formulate the question so that at least 2 or more possible answers are correct.
         - - Create 4 answer options so that in the end at least 2 out of 4 are correct and the rest are incorrect. Please adjust the correct answer options so that sometimes 3 out of 4 are correct or all 4 are correct. Please write at the end of each answer whether it is right or wrong.
         - Type “WF”:
         - - Formulate a statement that is either true or false.
         A question and the answer options should always be returned in the following Markdown format if the type “SC” or “MC” is required:
         ### {{counter}}. Question - {{type}}:
         {{ask}}
         **Answer:**
         1. {{answer1}} - {{right or wrong}}
         2. {{answer2}} - {{right or wrong}}
         3. {{answer3}} - {{right or wrong}}
         4. {{answer4}} - {{right or wrong}}
         A question and the answer options should always be returned in the following Markdown format if the type “WF” is required:
         ### {{counter}}. Question - {{type}}:
         {{ask}}
         **Answer:**
         {{answer}}
         Try to create the questions in such a way that different types can come one after the other. It is important that you always create the specified number of questions. I.e. if I say "MC: 2", then create 2 "MC" questions. Stick to the guidelines and don't think of anything new.
         According to the instructions, I would like you to create a knowledge test for me under the following conditions:
         Questions:
         - “SC”: {sc_count}
         - “MC”: {mc_count}
         - “WF”: {wf_count}
         Context:
         
                """
    elif lang_code == "fr-FR":
        prompt = f"""
                  Votre tâche consiste à créer un test de connaissances composé d'un certain nombre de questions basées sur un texte. Le texte fournit le « contexte » pour formuler les questions.
         Il existe trois types de questions différents :
         - Tapez « SC » :
         - - Formulez la question de telle sorte qu'il ne puisse y avoir qu'une seule bonne réponse.
         - - Créez 4 options de réponse pour qu'à la fin, seulement 1 sur 4 soit correcte et 3 sur 4 soient toujours fausses. En aucun cas plus d’une réponse ne doit être correcte. Veuillez écrire à la fin de chaque réponse si elle est bonne ou fausse.
         - Tapez « MC » :
         - - Formulez la question de manière à ce qu'au moins 2 réponses possibles ou plus soient correctes.
         - - Créez 4 options de réponse pour qu'à la fin, au moins 2 sur 4 soient correctes et les autres soient incorrectes. Veuillez ajuster les options de réponse correcte afin que parfois 3 sur 4 soient correctes ou que les 4 soient correctes. Veuillez écrire à la fin de chaque réponse si elle est bonne ou fausse.
         - Tapez « WF » :
         - - Formuler une affirmation qui est vraie ou fausse.
         Une question et les options de réponse doivent toujours être renvoyées dans le format Markdown suivant si le type « SC » ou « MC » est requis :
         ### {{comptoir}}. Type de question}}:
         {{demander}}
         **Répondre:**
         1. {{réponse1}} - {{vrai ou faux}}
         2. {{réponse2}} - {{vrai ou faux}}
         3. {{réponse3}} - {{vrai ou faux}}
         4. {{réponse4}} - {{vrai ou faux}}
         Une question et les options de réponse doivent toujours être renvoyées au format Markdown suivant si le type « WF » est requis :
         ### {{comptoir}}. Type de question}}:
         {{demander}}
         **Répondre:**
         {{répondre}}
         Essayez de créer les questions de manière à ce que différents types puissent se succéder. Il est important que vous créiez toujours le nombre spécifié de questions. C'est-à-dire que si je dis « MC : 2 », alors créez 2 questions « MC ». Respectez les directives et ne pensez à rien de nouveau.
         Selon les instructions, j'aimerais que vous me créiez un test de connaissances dans les conditions suivantes :
         Des questions:
         - « SC » : {sc_count}
         - « MC » : {mc_count}
         - « WF » : {wf_count}
         Contexte:
         
                        """
    elif lang_code == "ar-XA":
        prompt = f"""
                          مهمتك هي إنشاء اختبار معرفة يتكون من عدد معين من الأسئلة بناءً على النص. يوفر النص "السياق" لصياغة الأسئلة.
         هناك ثلاثة أنواع مختلفة من الأسئلة:
         - النوع "SC":
         - - قم بصياغة السؤال بحيث لا يمكن أن يكون هناك سوى إجابة واحدة صحيحة.
         - - أنشئ 4 خيارات للإجابة بحيث يكون في النهاية خيار واحد فقط من أصل 4 صحيحًا و3 من أصل 4 دائمًا خطأ. لا يجوز تحت أي ظرف من الظروف أن تكون أكثر من إجابة واحدة صحيحة. يرجى الكتابة في نهاية كل إجابة ما إذا كانت صحيحة أم خاطئة.
         - نوع "MC":
         - - قم بصياغة السؤال بحيث تكون إجابتان محتملتان أو أكثر صحيحتين على الأقل.
         - - قم بإنشاء 4 خيارات للإجابة بحيث يكون في النهاية 2 من 4 على الأقل صحيحين والباقي غير صحيح. يرجى ضبط خيارات الإجابة الصحيحة بحيث تكون في بعض الأحيان 3 من 4 صحيحة أو الأربعة جميعها صحيحة. يرجى الكتابة في نهاية كل إجابة ما إذا كانت صحيحة أم خاطئة.
         - النوع "WF":
         - - صياغة عبارة صحيحة أو خاطئة.
         يجب دائمًا إرجاع السؤال وخيارات الإجابة بتنسيق Markdown التالي إذا كان النوع "SC" أو "MC" مطلوبًا:
         ### {{عداد}}. نوع السؤال}}:
         {{بسأل}}
         **إجابة:**
         1. {{إجابة1}} - {{صحيح أم خطأ}}
         2. {{إجابة2}} - {{صحيح أم خطأ}}
         3. {{إجابة3}} - {{صحيح أم خطأ}}
         4. {{إجابة4}} - {{صحيح أم خطأ}}
         يجب دائمًا إرجاع السؤال وخيارات الإجابة بتنسيق Markdown التالي إذا كان النوع "WF" مطلوبًا:
         ### {{عداد}}. نوع السؤال}}:
         {{بسأل}}
         **إجابة:**
         {{إجابة}}
         حاول إنشاء الأسئلة بطريقة يمكن أن تأتي الأنواع المختلفة واحدة تلو الأخرى. من المهم أن تقوم دائمًا بإنشاء العدد المحدد من الأسئلة. على سبيل المثال، إذا قلت "MC: 2"، فقم بإنشاء سؤالين "MC". التزم بالإرشادات ولا تفكر في أي شيء جديد.
         حسب التعليمات أرجو منكم عمل اختبار معرفي لي بالشروط التالية:
         يسأل:
         - "SC": {sc_count}
         - "MC": {mc_count}
         - "WF": {wf_count}
         سياق:
         
                                """
    else:
        prompt = f"""
        Deine Aufgabe ist es, einen Wissenstest, der aus einer bestimmten Anzahl an Fragen besteht, basierend auf einem Text zu erstellen. Der Text stellt den “Kontext” dar, für die Formulierung der Fragen.
        Es gibt drei verschiedene Frage-Typen:
        - Typ “SC”:
        - - Formuliere die Frage so, dass es nur genau eine richtige Antwortmöglichkeit geben kann.
        - - Erstelle 4 Antwortmöglichkeiten, so dass am Ende immer nur 1 von 4 richtig ist und 3 von 4 immer falsch sind. Es darf unter keinen Umständen vorkommen, dass mehr als 1 Antwort richtig ist. Bitte schreibe am Schluss jeder Antwort ob es richtig oder falsch ist.
        - Typ “MC”:
        - - Formuliere die Frage so, dass min. 2 oder mehr Antwortmöglichkeiten richtig sind.
        - - Erstelle 4 Antwortmöglichkeiten, so dass am Ende min. 2 von 4 richtig sind und der Rest falsch. Bitte passe die richtigen Antwortmöglichkeiten so an, dass manchmal 3 von 4 richtig sind oder auch alle 4 richtig sind. Bitte schreibe am Schluss jeder Antwort ob es richtig oder falsch ist.
        - Typ “WF”:
        - - Formuliere eine Aussage, die entweder wahr oder falsch ist.
        Eine Frage und die Antwortmöglichkeiten sollten immer im folgenden Markdown-Format von dir zurückgegeben werden, sofern der Typ “SC” oder “MC” gefragt ist:
        ### {{counter}}. Frage - {{typ}}:
        {{frage}}
        **Antworten:**
        1. {{antwort1}} - {{richtig oder falsch}}
        2. {{antwort2}} - {{richtig oder falsch}}
        3. {{antwort3}} - {{richtig oder falsch}}
        4. {{antwort4}} - {{richtig oder falsch}}
        Eine Frage und die Antwortmöglichkeiten sollten immer im folgenden Markdown-Format von dir zurückgegeben werden, sofern der Typ “WF”gefragt ist:
        ### {{counter}}. Frage - {{typ}}:
        {{frage}}
        **Antwort:**
        {{antwort}}
        Versuche die Fragen so zu erstellen, dass auch unterschiedliche Typen nach einander kommen können. Es ist wichtig, dass du immer die vorgegebene Anzahl an Fragen erstellst. D.h. wenn ich sage "MC: 2", dann erstelle 2 "MC"-Fragen. Halte dich an die Vorgaben und denke dir nichts neues aus.
        Gemäß den Anweisungen möchte ich, dass du mir einen Wissenstest erstellst unter folgenden Bedingungen:
        Fragen:
        - “SC”: {sc_count}
        - “MC”: {mc_count}
        - “WF”: {wf_count}
        Kontext:
        
        """
    sc_questions_collection = []
    mc_questions_collection = []
    wf_questions_collection = []
    collections_array = [sc_questions_collection, mc_questions_collection, wf_questions_collection]

    while True:
        current_key = keys[current_index]
        print(current_key)
        elapsed_time = time.time() - start_time
        if elapsed_time >= 60:
            print("Timeout reached. Exiting the loop.")
            isTimedOut = True
            break

        # Add a sleep to avoid high CPU usage
        time.sleep(1)  # Sleep for 1 second to avoid busy waiting
        multiline_input = reduce_to_tokens(multiline_input, spacy_lang.get(lang_code),isquestions=True)
        prompt = prompt + multiline_input
        prompt = remove_empty_lines(prompt)
        while True:
            try:
                result = new_call_language_model(prompt, current_key)
                break
            except Exception as e:
                print(e)
                print(f"An exception occurred. Moving to the next key.")
                break

                current_index = (current_index + 1) % keys_len

        result = remove_empty_lines(result)
        lines = result.strip().split("\n")

        question_object = {"question": "", "answers": [], "correct_answers": []}
        if lang_code == "en-US":
            for index, line in enumerate(lines):
                if line[0].isdigit():
                    question_object["answers"].append(line.split(" - ")[0].split('.', 1)[1].strip())
                    if line.split(" - ")[1].strip() == "Right" or line.split(" - ")[1].strip() == "right":
                        question_object["correct_answers"].append(line.split(" - ")[0].split('.', 1)[1].strip())
                elif line[0].isalpha() and line[
                    0].isupper() and line.upper().strip() != "TRUE" and line.upper().strip() != "FALSE":
                    question_object["question"] = line.strip()
                elif line.upper().strip() == "TRUE" or line.upper().strip() == "FALSE":
                    question_object["answers"] = ["true", "false"]
                    question_object["correct_answers"].append(line.lower().strip())
                if (line[0] == "#" and line[1] == "#" and line[2] == "#" and question_object[
                    "question"] != "") or index == len(lines) - 1:
                    mc_questions_collection.append(question_object)
                    question_object = {"question": "", "answers": [], "correct_answers": []}
        elif lang_code == "fr-FR":
            for index, line in enumerate(lines):
                if line[0].isdigit():
                    question_object["answers"].append(line.split(" - ")[0].split('.', 1)[1].strip())
                    if line.split(" - ")[1].strip() == "Vrai" or line.split(" - ")[1].strip() == "vrai":
                        question_object["correct_answers"].append(line.split(" - ")[0].split('.', 1)[1].strip())
                elif line[0].isalpha() and line[
                    0].isupper() and line.upper().strip() != "VRAI" and line.upper().strip() != "FAUX":
                    question_object["question"] = line.strip()
                elif line.upper().strip() == "VRAI" or line.upper().strip() == "FAUX":
                    question_object["answers"] = ["vrai", "faux"]
                    question_object["correct_answers"].append(line.lower().strip())
                if (line[0] == "#" and line[1] == "#" and line[2] == "#" and question_object[
                    "question"] != "") or index == len(lines) - 1:
                    mc_questions_collection.append(question_object)
                    question_object = {"question": "", "answers": [], "correct_answers": []}
        elif lang_code == "ar-XA":
            for index, line in enumerate(lines):
                if line[0].isdigit():
                    question_object["answers"].append(line.split(" - ")[0].split('.', 1)[1].strip())
                    if line.split(" - ")[1].strip() == "صحيح":
                        question_object["correct_answers"].append(line.split(" - ")[0].split('.', 1)[1].strip())
                elif line[0].isalpha() and line[
                    0] and line.upper().strip() != "صحيح" and line.strip() != "خطأ":
                    question_object["question"] = line.strip()
                elif line.strip() == "صحيح" or line.strip() == "خطأ":
                    question_object["answers"] = ["صحيح", "خطأ"]
                    question_object["correct_answers"].append(line.strip())
                if (line[0] == "#" and line[1] == "#" and line[2] == "#" and question_object[
                    "question"] != "") or index == len(lines) - 1:
                    mc_questions_collection.append(question_object)
                    question_object = {"question": "", "answers": [], "correct_answers": []}
        else:
            for index, line in enumerate(lines):
                if line[0].isdigit():
                    question_object["answers"].append(line.split(" - ")[0].split('.', 1)[1].strip())
                    if line.split(" - ")[1].strip() == "richtig" or line.split(" - ")[1].strip() == "Richtig":
                        question_object["correct_answers"].append(line.split(" - ")[0].split('.', 1)[1].strip())
                elif line[0].isalpha() and line[
                    0].isupper() and line.upper().strip() != "WAHR" and line.upper().strip() != "FALSCH":
                    question_object["question"] = line.strip()
                elif line.upper().strip() == "WAHR" or line.upper().strip() == "FALSCH":
                    question_object["answers"] = ["wahr", "falsch"]
                    question_object["correct_answers"].append(line.lower().strip())
                if (line[0] == "#" and line[1] == "#" and line[2] == "#" and question_object[
                    "question"] != "") or index == len(lines) - 1:
                    mc_questions_collection.append(question_object)
                    question_object = {"question": "", "answers": [], "correct_answers": []}
        total_size = mc_count + wf_count + sc_count
        mc_questions_collection = mc_questions_collection[:total_size]
        mc_questions_collection = remove_duplicates(mc_questions_collection)
        if len(mc_questions_collection) < total_size:
            print("AI returned fewer questions than requested, restarting...")
            print(mc_questions_collection)
        else:
            mc_questions_collection[:] = [x for x in mc_questions_collection if len(x["answers"]) >= 1]
            break

    return jsonify(file_name=global_file_name,
                   questions=mc_questions_collection, isTimedOut=isTimedOut)


@app.route('/api/create_conversation_mono_fast', methods=['POST'])
def create_conversation_mono_fast():
    global current_index
    global keys_len
    current_index = random.randint(0, keys_len - 1)
    request_data = request.get_json()

    # speaker = request_data.get('speaker')
    scenarios = request_data.get('scenarios')  # this is an array, scenarios[content] for each entry
    sceneName = request_data.get('sceneName')
    lang_code = request_data.get('lang_code')
    multiline_input = '\n'.join(scenario['content'] for scenario in scenarios)
    if lang_code == "en-US":
        prompt = f"""
        a very short monologue, in English, on this topic:
                    
                    """
    elif lang_code == "fr-FR":
        prompt = f"""
        un très court monologue, en français, sur ce sujet :
                            
                            """
    elif lang_code == "ar-XA":
        prompt = f"""
        مونولوج قصير جداً, باللغة العربية, حول هذا الموضوع:
                            
                            """
    else:
        prompt = f"""
            ein sehr kurzer Monolog auf Deutsch zu diesem Thema:
            
            """
    multiline_input = reduce_to_tokens(multiline_input, spacy_lang.get(lang_code))
    prompt = prompt + multiline_input
    prompt = remove_empty_lines(prompt)
    while True:
        current_key = keys[current_index]
        print(current_key)

        try:
            speech = new_call_language_model(prompt, current_key)
            break
        except Exception as e:
            print(e)
            print(f"An exception occurred. Moving to the next key.")
            break

        current_index = (current_index + 1) % keys_len

    speech = remove_empty_lines(speech)

    return jsonify(speech=speech, title=scenarios[0]['title'], sceneName=sceneName)


@app.route('/api/create_conversation_mono_podcast', methods=['POST'])
def create_conversation_mono_podcast():
    global current_index
    global keys_len
    current_index = random.randint(0, keys_len - 1)
    request_data = request.get_json()

    # speaker = request_data.get('speaker')
    scenarios = request_data.get('scenarios')  # this is an array, scenarios[content] for each entry
    sceneName = request_data.get('sceneName')
    position = request_data.get('position')
    lang_code = request_data.get('lang_code')
    lang_dict = {"fr-FR": "Französisch", "en-US": "Englisch", "de-DE": "Deutsch"}

    multiline_input = '\n'.join(scenario['content'] for scenario in scenarios)
    if position == "first":
        if lang_code == "ar-XA":
            prompt = f"""
                            مهمتك هي إنشاء بودكاست بناءً على النص. يوفر النص "السياق" لصياغة البودكاست.
               يرجى الالتزام الصارم بالقواعد التالية:
               - يجب أن يكون البودكاست باللغة العربية حصراً 
               - يجب أن يبدأ المتحدث بالسلام على المستمعين وتعريفهم بموضوع البودكاست
               - يجب أن يبدو البودكاست وكأنه قصة من المثير جدًا سردها، ولكن من المثير أيضًا الاستماع إليها.
               - أعد كتابة النص في السياق المحدد فقط، ولا تخترع أي شيء جديد تحت أي ظرف من الظروف.
               - يرجى الاحتفاظ بالألفاظ الانجليزية وعدم تغييرها.
               - يرجى تكرار النقاط الرئيسية للبودكاست في النهاية حتى يتذكرها المستمع.
               سياق:
                 
                            """

        else:
            prompt = f"""
                Ihre Aufgabe besteht darin, einen Podcast basierend auf einem Text zu erstellen. Der Text liefert den „Kontext“ für die Formulierung des Podcasts.
              Bitte halten Sie sich strikt an folgende Regeln:
              - Der Podcast muss ausschließlich auf {lang_dict[lang_code]} sein
              - Der Redner muss damit beginnen, die Zuhörer zu begrüßen und ihnen das Thema des Podcasts näher zu bringen
              - Der Podcast soll wie eine Geschichte wirken, die sehr spannend zu erzählen, aber auch spannend anzuhören ist.
              - Schreiben Sie den Text nur im gegebenen Kontext um, erfinden Sie auf keinen Fall etwas Neues.
              - Bitte behalten Sie Anglizismen bei und ändern Sie diese nicht.
              - Bitte wiederholen Sie am Ende die wichtigsten Punkte des Podcasts, damit sich der Hörer daran erinnern kann.
              Kontext:
                
                """
    elif position == "last":
        if lang_code == "ar-XA":
            prompt = f"""
                                    مهمتك هي إنشاء بودكاست بناءً على النص. يوفر النص "السياق" لصياغة البودكاست.
                                   يرجى الالتزام الصارم بالقواعد التالية:
                                   - يجب أن يكون البودكاست باللغة العربية حصراً
                                   - لا يجوز للمتحدث إلقاء التحية على المستمعين أو تعريفهم بموضوع البودكاست
                                   - يجب أن يبدو البودكاست وكأنه قصة من المثير جدًا سردها، ولكن من المثير أيضًا الاستماع إليها.
                                   - أعد كتابة النص في السياق المحدد فقط، ولا تخترع أي شيء جديد تحت أي ظرف من الظروف.
                                   - يرجى الاحتفاظ بالألفاظ الانجليزية وعدم تغييرها.
                                   - في النهاية يرجى تكرار النقاط الرئيسية للبودكاست حتى يتذكرها المستمع، ثم يشكر المتحدث المستمعين على استماعهم ويودعهم.
                                   سياق:
                                     
                                    """
        else:
            prompt = f"""
                        Ihre Aufgabe besteht darin, einen Podcast basierend auf einem Text zu erstellen. Der Text liefert den „Kontext“ für die Formulierung des Podcasts.
                      Bitte halten Sie sich strikt an folgende Regeln:
                      - Der Podcast muss ausschließlich auf {lang_dict[lang_code]} sein
                      - Der Sprecher darf die Zuhörer nicht grüßen und sie nicht in das Thema des Podcasts einführen
                      - Der Podcast soll wie eine Geschichte wirken, die sehr spannend zu erzählen, aber auch spannend anzuhören ist.
                      - Schreiben Sie den Text nur im gegebenen Kontext um, erfinden Sie auf keinen Fall etwas Neues.
                      - Bitte behalten Sie Anglizismen bei und ändern Sie diese nicht.
                      - Am Ende wiederholen Sie bitte die wichtigsten Punkte des Podcasts, damit sich der Hörer daran erinnern kann, dann bedankt sich der Sprecher bei den Hörern fürs Zuhören und verabschiedet sich von ihnen.
                      Kontext:
                        
                        """
    elif position == "first&last":
        if lang_code == "ar-XA":
            prompt = f"""
                                    مهمتك هي إنشاء بودكاست بناءً على النص. يوفر النص "السياق" لصياغة البودكاست.
                                   يرجى الالتزام الصارم بالقواعد التالية:
                                   - يجب أن يكون البودكاست باللغة العربية حصراً
                                   - يجب أن يبدأ المتحدث بالسلام على المستمعين وتعريفهم بموضوع البودكاست
                                   - يجب أن يبدو البودكاست وكأنه قصة من المثير جدًا سردها، ولكن من المثير أيضًا الاستماع إليها.
                                   - أعد كتابة النص في السياق المحدد فقط، ولا تخترع أي شيء جديد تحت أي ظرف من الظروف.
                                   - يرجى الاحتفاظ بالألفاظ الانجليزية وعدم تغييرها.
                                   - في النهاية يرجى تكرار النقاط الرئيسية للبودكاست حتى يتذكرها المستمع، ثم يشكر المتحدث المستمعين على استماعهم ويودعهم.
                                   سياق:
                                     
                                    """
        else:
            prompt = f"""
                        Ihre Aufgabe besteht darin, einen Podcast basierend auf einem Text zu erstellen. Der Text liefert den „Kontext“ für die Formulierung des Podcasts.
                      Bitte halten Sie sich strikt an folgende Regeln:
                      - Der Podcast muss ausschließlich auf {lang_dict[lang_code]} sein
                      - Der Redner muss damit beginnen, die Zuhörer zu begrüßen und ihnen das Thema des Podcasts näher zu bringen
                      - Der Podcast soll wie eine Geschichte wirken, die sehr spannend zu erzählen, aber auch spannend anzuhören ist.
                      - Schreiben Sie den Text nur im gegebenen Kontext um, erfinden Sie auf keinen Fall etwas Neues.
                      - Bitte behalten Sie Anglizismen bei und ändern Sie diese nicht.
                      - Am Ende wiederholen Sie bitte die wichtigsten Punkte des Podcasts, damit sich der Hörer daran erinnern kann, dann bedankt sich der Sprecher bei den Hörern fürs Zuhören und verabschiedet sich von ihnen.
                      Kontext:
                        
                        """

    else:
        if lang_code == "ar-XA":
            prompt = f"""
                                    مهمتك هي إنشاء بودكاست بناءً على النص. يوفر النص "السياق" لصياغة البودكاست.
                       يرجى الالتزام الصارم بالقواعد التالية:
                       - يجب أن يكون البودكاست باللغة العربية حصراً
                       - لا يجوز للمتحدث إلقاء التحية على المستمعين أو تعريفهم بموضوع البودكاست
                       - يجب أن يبدو البودكاست وكأنه قصة من المثير جدًا سردها، ولكن من المثير أيضًا الاستماع إليها.
                       - أعد كتابة النص في السياق المحدد فقط، ولا تخترع أي شيء جديد تحت أي ظرف من الظروف.
                       - يرجى الاحتفاظ بالألفاظ الانجليزية وعدم تغييرها.
                       - يرجى تكرار النقاط الرئيسية للبودكاست في النهاية حتى يتذكرها المستمع.
                       سياق:
                         
                                    """
        else:
            prompt = f"""
                        Ihre Aufgabe besteht darin, einen Podcast basierend auf einem Text zu erstellen. Der Text liefert den „Kontext“ für die Formulierung des Podcasts.
                      Bitte halten Sie sich strikt an folgende Regeln:
                      - Der Podcast muss ausschließlich auf {lang_dict[lang_code]} sein
                      - Der Sprecher darf die Zuhörer nicht grüßen und sie nicht in das Thema des Podcasts einführen
                      - Der Podcast soll wie eine Geschichte wirken, die sehr spannend zu erzählen, aber auch spannend anzuhören ist.
                      - Schreiben Sie den Text nur im gegebenen Kontext um, erfinden Sie auf keinen Fall etwas Neues.
                      - Bitte behalten Sie Anglizismen bei und ändern Sie diese nicht.
                      - Bitte wiederholen Sie am Ende die Hauptpunkte des Podcasts, damit sich der Hörer daran erinnern kann..
                      Kontext:
                        
                        """
    multiline_input = reduce_to_tokens(multiline_input, spacy_lang.get(lang_code))
    prompt = prompt + multiline_input
    prompt = remove_empty_lines(prompt)
    while True:
        current_key = keys[current_index]
        print(current_key)
        try:
            speech = new_call_language_model(prompt, current_key)
            break
        except Exception as e:
            print(e)
            print(f"An exception occurred. Moving to the next key.")
            break

        current_index = (current_index + 1) % keys_len

    speech = speech.replace("Podcast:", "")
    speech = remove_empty_lines(speech)
    return jsonify(speech=speech, title=scenarios[0]['title'], sceneName=sceneName)


@app.route('/api/create_video_mono', methods=['POST'])
def create_video_mono():
    host = request.host.split(':')[0].strip()  # Get the host (hostname or IP address)
    global current_progress
    current_progress = Progress("Initiieren...", "0%")
    global current_index
    global keys_len
    current_index = random.randint(0, keys_len - 1)
    request_data = request.get_json()
    backgroundImage = request_data.get('backgroundImage')
    char = request_data.get('speaker')
    title = request_data.get('title')
    sceneName = request_data.get('sceneName')
    speech = request_data.get('speech')
    speech = speech.replace(".", "!")
    speech = speech.replace(",", "!")
    lang_code = request_data.get('lang_code')
    voice = request_data.get('voice') + "_" + lang_code
    position = request_data.get('position')
    subtitles = []

    audio_paths = []

    backgroundImage = backgrounds[backgroundImage]

    try:
        for key, value in abbreviation.items():
            speech = speech.replace(key, value)
        voice = voices[voice]
    except:
        for key, value in open_ai_abbreviation.items():
            speech = speech.replace(key, value)
        voice = openai_voices[voice]
    current_progress = Progress("Themen zusammenfassend...", "20%")

    if lang_code == "fr-FR":
        prompt = f"""
                        Résumez le sujet de ce discours, en français, en quelques puces avec « - » et un maximum de trois mots par ligne:
                       
                       """
    elif lang_code == "en-US":
        prompt = f"""
                                Summarize the subject of this speech, in english, in a few bullet points with “-” and a maximum of three words per line:
                               
                               """
    elif lang_code == "ar-XA":
        prompt = f"""
                                        لخص موضوع هذا الخطاب, باللغة العربية, في بضع نقاط مع "-" وبحد أقصى ثلاث كلمات في كل سطر:
                                       
                                       """

    else:
        prompt = f"""
                Fassen Sie das Thema dieser Rede, auf Deutsch, in wenigen Stichpunkten mit „-“ und maximal drei Wörtern pro Zeile zusammen:
               
               """
    speech = reduce_to_tokens(speech, spacy_lang.get(lang_code))
    prompt = prompt + speech
    prompt = remove_empty_lines(prompt)
    while True:
        current_key = keys[current_index]
        print(current_key)

        try:
            keyword = new_call_language_model(prompt, current_key)
            break
        except Exception as e:
            print(e)
            print(f"An exception occurred. Moving to the next key.")
            break

        current_index = (current_index + 1) % keys_len

    print("Generating Speech...")
    current_progress = Progress("Audio erzeugen...", "40%")
    unique_id = str(uuid.uuid4())
    if host == "127.0.0.1":
        audio_output = unique_id + "_output.mp3"
    else:
        audio_output = "/home/explainIO/mysite/" + unique_id + "_output.mp3"

    audio_paths.append(audio_output)
    try:
        synthesize_text(speech, audio_output, voice, host, lang_code)
    except:
        while True:
            current_key = keys[current_index]
            print(current_key)
            try:
                synthesize_text_openai(speech, audio_output, voice, current_key, lang_code)
                break
            except Exception as e:
                print(e)
                print(f"An exception occurred. Moving to the next key.")

            current_index = (current_index + 1) % keys_len

    duration = get_audio_duration(audio_output)
    subtitles.append({"sentence": speech, "duration": duration})
    current_progress = Progress("Video erzeugen...", "60%")

    if host == "127.0.0.1":

        prototype, entrance = stick_videos_mono('assets/mono/' + backgroundImage + '/' + avatars[char] + ".mp4",
                                                audio_output,
                                                "output_file.mp4", position, host)

    else:
        prototype, entrance = stick_videos_mono(
            '/home/explainIO/mysite/assets/mono/' + backgroundImage + '/' + avatars[char] + ".mp4", audio_output,
            "output_file.mp4", position, host)

    start_time = time.time()
    if host == "127.0.0.1":

        temp_path = "temp_output_file_mono" + str(uuid.uuid4()) + ".mp4"
        path = "output_file_mono" + str(uuid.uuid4()) + ".mp4"
        add_logo(prototype, title, temp_path, path, "text_image_mono" + str(uuid.uuid4()) + ".png", host, prototype,
                 text2=keyword, isSolo=True, entrance=entrance, sfx=sfx[backgroundImage], lang_code=lang_code)
        thumbnail_path = "thumbnail_mono" + str(uuid.uuid4()) + ".jpg"
        generate_thumbnail(path, thumbnail_path)
    else:
        temp_path = "/home/explainIO/mysite/" + "temp_output_file_mono" + str(uuid.uuid4()) + ".mp4"
        path = "/home/explainIO/mysite/" + "output_file_mono" + str(uuid.uuid4()) + ".mp4"
        add_logo(prototype, title, temp_path, path,
                 "/home/explainIO/mysite/" + "text_image_mono" + str(uuid.uuid4()) + ".png", host, prototype,
                 text2=keyword, isSolo=True, entrance=entrance, sfx=sfx[backgroundImage], lang_code=lang_code)
        thumbnail_path = "/home/explainIO/mysite/" + "thumbnail_mono" + str(uuid.uuid4()) + ".jpg"
        generate_thumbnail(path, thumbnail_path)
    end_time = time.time()
    duration = end_time - start_time
    print(f"The writing took {duration} seconds.")
    print("Uploading To Firebase...")
    current_progress = Progress("Hochladen in die Datenbank...", "80%")

    if host == "127.0.0.1":
        file_name = save_to_firebase(path, thumbnail_path, "mono_" + title, host)
    else:
        file_name = save_to_firebase(path, thumbnail_path, "mono_" + title, host)

    global global_file_name
    global_file_name = file_name
    for my_path in audio_paths:
        delete_file_if_unused(my_path)

    delete_file_if_unused(path)
    current_progress = Progress("Erledigt !", "100%")

    return jsonify(file_name=file_name, subtitles=subtitles, speech=speech, title=title, sceneName=sceneName,
                   speakerNames=[char])


@app.route('/api/create_podcast', methods=['POST'])
def create_podcast():
    host = request.host.split(':')[0].strip()  # Get the host (hostname or IP address)

    global current_index
    global keys_len
    current_index = random.randint(0, keys_len - 1)
    request_data = request.get_json()
    title = request_data.get('title')
    sceneName = request_data.get('sceneName')
    lang_code = request_data.get('lang_code')
    voice1_name = request_data.get('voice1') + "_" + lang_code
    voice2_name = request_data.get('voice2') + "_" + lang_code
    conversation = request_data.get('conversation')
    subtitles = []

    audio_paths = []

    conv = split_conversation(remove_empty_lines(conversation))

    try:
        voice1 = voices[voice1_name]
    except:
        voice1 = openai_voices[voice1_name]
    try:
        voice2 = voices[voice2_name]
    except:
        voice2 = openai_voices[voice2_name]

    print("Generating Conversation...")
    for pair in conv:
        print(pair.personA)
        unique_id1 = str(uuid.uuid4())
        unique_id2 = str(uuid.uuid4())
        if host == "127.0.0.1":
            audio1_output = unique_id1 + "_output.mp3"
            audio2_output = unique_id2 + "_output.mp3"
        else:
            audio1_output = "/home/explainIO/mysite/" + unique_id1 + "_output.mp3"
            audio2_output = "/home/explainIO/mysite/" + unique_id2 + "_output.mp3"
        audio_paths.append(audio1_output)
        audio_paths.append(audio2_output)

        try:
            for key, value in abbreviation.items():
                pair.personA = pair.personA.replace(key, value)
            synthesize_text(pair.personA, audio1_output, voice1, host, lang_code)
        except:
            while True:
                current_key = keys[current_index]
                print(current_key)
                try:
                    for key, value in open_ai_abbreviation.items():
                        pair.personA = pair.personA.replace(key, value)
                    synthesize_text_openai(pair.personA, audio1_output, voice1, current_key, lang_code)
                    break
                except Exception as e:
                    print(e)
                    print(f"An exception occurred. Moving to the next key.")

                current_index = (current_index + 1) % keys_len

        print(pair.personB)
        try:
            for key, value in abbreviation.items():
                pair.personB = pair.personB.replace(key, value)
            synthesize_text(pair.personB, audio2_output, voice2, host, lang_code)
        except:
            while True:
                current_key = keys[current_index]
                print(current_key)
                try:
                    for key, value in open_ai_abbreviation.items():
                        pair.personB = pair.personB.replace(key, value)
                    synthesize_text_openai(pair.personB, audio2_output, voice2, current_key, lang_code)
                    break
                except Exception as e:
                    print(e)
                    print(f"An exception occurred. Moving to the next key.")

                current_index = (current_index + 1) % keys_len

        print()
        duration1 = get_audio_duration(audio1_output)
        duration2 = get_audio_duration(audio2_output)
        sentence1 = pair.personA
        sentence2 = pair.personB
        if sentence1 != "":
            subtitles.append({"sentence": sentence1, "duration": duration1})
        if sentence2 != "":
            subtitles.append({"sentence": sentence2, "duration": duration2})
    if host == "127.0.0.1":
        thumbnail_path = "thumbnail_podcast" + str(uuid.uuid4()) + ".png"
        generate_thumbnail_podcast(title, thumbnail_path, host)
        path = "podcast_output" + str(uuid.uuid4()) + ".mp3"
    else:
        thumbnail_path = "/home/explainIO/mysite/thumbnail_podcast" + str(uuid.uuid4()) + ".png"
        generate_thumbnail_podcast(title, thumbnail_path, host)
        path = "/home/explainIO/mysite/podcast_output" + str(uuid.uuid4()) + ".mp3"

    combine_mp3_files(audio_paths, path)

    print("Uploading To Firebase...")

    if host == "127.0.0.1":
        file_name = save_to_firebase(path, thumbnail_path, "podcast_dual_" + title, host)
    else:
        file_name = save_to_firebase(path, thumbnail_path, "podcast_dual_" + title,
                                     host)

    global global_file_name
    global_file_name = file_name
    # conversation = conversation.replace("Person A:", "")
    # conversation = conversation.replace("Person 1:", "")
    # conversation = conversation.replace("Person B:", "")
    # conversation = conversation.replace("Person 2:", "")
    # conversation = conversation.strip()
    # conversation = remove_empty_lines(conversation)

    for my_path in audio_paths:
        delete_file_if_unused(my_path)
    delete_file_if_unused(path)

    return jsonify(file_name=file_name, subtitles=subtitles, conversation=conversation,
                   speakerNames=[voice1_name, voice2_name], title=title, sceneName=sceneName)


@app.route('/api/create_podcast_mono', methods=['POST'])
def create_podcast_mono():
    global current_progress
    current_progress = Progress("Initiieren...", "0%")
    host = request.host.split(':')[0].strip()  # Get the host (hostname or IP address)
    global current_index
    global keys_len
    current_index = random.randint(0, keys_len - 1)
    request_data = request.get_json()
    title = request_data.get('title')
    sceneName = request_data.get('sceneName')
    speech = request_data.get('speech')
    speech = speech.replace(".", "!")
    speech = speech.replace(",", "!")
    lang_code = request_data.get('lang_code')
    voice_name = request_data.get('voice') + "_" + lang_code

    subtitles = []

    speech = remove_empty_lines(speech)
    position = request_data.get('position')
    current_progress = Progress("Sprache erzeugen...", "40%")
    try:
        for key, value in abbreviation.items():
            speech = speech.replace(key, value)
        voice = voices[voice_name]
    except:
        for key, value in open_ai_abbreviation.items():
            speech = speech.replace(key, value)
        voice = openai_voices[voice_name]
    print("Generating Conversation...")
    if host == "127.0.0.1":
        path = "podcast_output_mono" + str(uuid.uuid4()) + ".mp3"
        intro_path = "podcast_intro_mono" + str(uuid.uuid4()) + ".mp3"
    else:
        path = "/home/explainIO/mysite/podcast_output_mono" + str(uuid.uuid4()) + ".mp3"
        intro_path = "/home/explainIO/mysite/podcast_intro_mono" + str(uuid.uuid4()) + ".mp3"

    try:
        synthesize_text(speech, path, voice, host, lang_code)
        if position == "first" or position == "first&last":
            if lang_code == "en-US":
                synthesize_text("Welcome to „explain Podcast“ !", intro_path, voice, host, lang_code)
            elif lang_code == "fr-FR":
                synthesize_text("Bienvenue dans „explain Podcast“ !", intro_path, voice, host, lang_code)
            elif lang_code == "ar-XA":
                synthesize_text("مرحبًا بكم في „explain Podcast“ !", intro_path, voice, host, lang_code)
            else:
                synthesize_text("Willkommen beim „explain Podcast“ !", intro_path, voice, host, lang_code)
    except:
        while True:
            current_key = keys[current_index]
            print(current_key)
            try:
                synthesize_text_openai(speech, path, voice, current_key, lang_code)
                if position == "first" or position == "first&last":
                    if lang_code == "en-US":
                        synthesize_text_openai("Welcome to „explain Podcast“ !", intro_path, voice, current_key,
                                               lang_code)
                    elif lang_code == "fr-FR":
                        synthesize_text_openai("Bienvenue dans „explain Podcast“ !", intro_path, voice, current_key,
                                               lang_code)
                    elif lang_code == "ar-XA":
                        synthesize_text_openai("مرحبًا بكم في „explain Podcast“ !", intro_path, voice, current_key,
                                               lang_code)
                    else:
                        synthesize_text_openai("Willkommen beim „explain Podcast“ !", intro_path, voice, current_key,
                                               lang_code)
                break
            except Exception as e:
                print(e)
                print(f"An exception occurred. Moving to the next key.")

            current_index = (current_index + 1) % keys_len
    current_progress = Progress("Hinzufügen von Audioeffekten...", "60%")
    add_podcast_effects(path, path, intro_path, position, host)
    duration = get_audio_duration(path)
    subtitles.append({"sentence": speech, "duration": duration})
    if host == "127.0.0.1":
        thumbnail_path = "thumbnail_podcast_mono" + str(uuid.uuid4()) + ".png"
        generate_thumbnail_podcast(title, thumbnail_path, host)
    else:
        thumbnail_path = "/home/explainIO/mysite/thumbnail_podcast_mono" + str(uuid.uuid4()) + ".png"
        generate_thumbnail_podcast(title, thumbnail_path, host)

    print("Uploading To Firebase...")
    current_progress = Progress("Hochladen in die Datenbank...", "80%")

    if host == "127.0.0.1":
        file_name = save_to_firebase(path, thumbnail_path, "podcast_mono_" + title, host)
    else:
        file_name = save_to_firebase(path, thumbnail_path, "podcast_mono_" + title,
                                     host)

    global global_file_name
    global_file_name = file_name

    delete_file_if_unused(path)
    delete_file_if_unused(intro_path)
    current_progress = Progress("Erledigt !", "100%")
    return jsonify(file_name=file_name, subtitles=subtitles, conversation=speech,
                   speakerNames=[voice_name], title=title, sceneName=sceneName)


@app.route('/api/create_text_reader', methods=['POST'])
def create_text_reader():
    global current_progress
    current_progress = Progress("Initiieren...", "0%")
    host = request.host.split(':')[0].strip()  # Get the host (hostname or IP address)
    global current_index
    global keys_len
    current_index = random.randint(0, keys_len - 1)
    request_data = request.get_json()
    title = request_data.get('title')
    sceneName = request_data.get('sceneName')
    text = request_data.get('text')
    lang_code = request_data.get('lang_code')
    voice_name = request_data.get('voice') + "_" + lang_code

    subtitles = []

    text = remove_empty_lines(text)
    text = title + ": " + text
    current_progress = Progress("Audio erzeugen...", "40%")

    try:
        for key, value in abbreviation.items():
            text = text.replace(key, value)
        voice = voices[voice_name]
    except:
        for key, value in open_ai_abbreviation.items():
            text = text.replace(key, value)
        voice = openai_voices[voice_name]
    print("Generating Conversation...")
    if host == "127.0.0.1":
        path = "text_reader_output" + str(uuid.uuid4()) + ".mp3"
    else:
        path = "/home/explainIO/mysite/text_reader_output" + str(uuid.uuid4()) + ".mp3"

    try:
        synthesize_text(text, path, voice, host, lang_code)
    except:
        while True:
            current_key = keys[current_index]
            print(current_key)
            try:
                synthesize_text_openai(text, path, voice, current_key, lang_code)
                break
            except Exception as e:
                print(e)
                print(f"An exception occurred. Moving to the next key.")

            current_index = (current_index + 1) % keys_len

    duration = get_audio_duration(path)
    subtitles.append({"sentence": text, "duration": duration})
    if host == "127.0.0.1":
        thumbnail_path = "thumbnail_text_reader" + str(uuid.uuid4()) + ".png"
        generate_thumbnail_podcast(title, thumbnail_path, host)
    else:
        thumbnail_path = "/home/explainIO/mysite/thumbnail_text_reader" + str(uuid.uuid4()) + ".png"
        generate_thumbnail_podcast(title, thumbnail_path, host)

    print("Uploading To Firebase...")
    current_progress = Progress("Hochladen in die Datenbank...", "80%")

    if host == "127.0.0.1":
        file_name = save_to_firebase(path, thumbnail_path, "text_reader_" + title, host)
    else:
        file_name = save_to_firebase(path, thumbnail_path, "text_reader_" + title,
                                     host)

    global global_file_name
    global_file_name = file_name

    delete_file_if_unused(path)
    current_progress = Progress("Erledigt !", "100%")

    return jsonify(file_name=file_name, subtitles=subtitles, text=text,
                   speakerNames=[voice_name], title=title, sceneName=sceneName)


@app.route('/api/get_progress')
def get_progress():
    global current_progress
    return jsonify(operation=current_progress.operation, percentage=current_progress.percentage)


@app.route('/api/get_estimated_time_dual', methods=['POST'])
def get_estimated_time_dual():
    request_data = request.get_json()
    text = request_data.get('text')
    minutes, seconds, total_seconds = estimate_tts_time_dual(text)

    return jsonify(time=f"{minutes} Minuten und {seconds} Sekunden", total_seconds=total_seconds)


@app.route('/api/get_estimated_time_mono', methods=['POST'])
def get_estimated_time_mono():
    request_data = request.get_json()
    text = request_data.get('text')
    minutes, seconds, total_seconds = estimate_tts_time_mono(text)

    return jsonify(time=f"{minutes} Minuten und {seconds} Sekunden", total_seconds=total_seconds)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload_pdf', methods=['POST'])
def upload_file():
    host = request.host.split(':')[0].strip()  # Get the host (hostname or IP address)
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']

    # If the user does not select a file, the browser may send an empty file
    if file.filename == '':
        return jsonify({"error": "No selected file"})

    # Check if the file has an allowed extension
    if file and allowed_file(file.filename):
        # Ensure the 'uploads' folder exists
        file.filename = file.filename.replace(".pdf", str(uuid.uuid4()) + ".pdf")
        if host == "127.0.0.1":
            upload_path = 'uploads'
        else:
            upload_path = '/home/explainIO/mysite/uploads'
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)
        # Generate a secure filename and save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(upload_path, filename)
        file.save(filepath)
        reader = PyPDF2.PdfReader(filepath)
        bookmark_list = reader.outline
        final_result = bookmark_dict(bookmark_list, reader)
        if len(final_result) == 0:
            final_result = [{"title": "All", "text": ""}]
            for p in reader.pages:
                content = final_result[0]["text"] + "\n" + p.extract_text()
                final_result = [{"title": "All", "text": content, "page": "1-" + str(len(reader.pages))}]
        else:
            for index, item in enumerate(final_result):
                if index < len(final_result) - 1:
                    start_number, end_number = final_result[index]["page"], final_result[index + 1]["page"]
                    numbers_list = list(range(start_number + 1, end_number))
                    for n in numbers_list:
                        page = reader.pages[n]
                        item["text"] = item["text"] + "\n" + page.extract_text()
                else:
                    start_number, end_number = final_result[index]["page"], len(reader.pages)
                    numbers_list = list(range(start_number + 1, end_number))
                    for n in numbers_list:
                        page = reader.pages[n]
                        item["text"] = item["text"] + "\n" + page.extract_text()
        delete_file_if_unused(filepath)

        return jsonify(
            {"success": True, "message": "File uploaded successfully", "filename": filename, "result": final_result})

    return jsonify({"error": "Invalid file type"})


if __name__ == '__main__':
    app.run(debug=False)