# # # from video_processing import reduce_video_duration, excessive_crop_video_bottm_top
# # #
# # # # paths=["assets/mono/modern/av_1",
# # # #        "assets/mono/modern/av_2",
# # # #        "assets/mono/modern/av_3",
# # # #        "assets/mono/modern/av_4",
# # # #        "assets/mono/modern/av_5",
# # # #        "assets/mono/modern/av_6",
# # # #        "assets/mono/classroom/av_1",
# # # #        "assets/mono/classroom/av_2",
# # # #        "assets/mono/classroom/av_3",
# # # #        "assets/mono/classroom/av_4",
# # # #        "assets/mono/classroom/av_5",
# # # #        "assets/mono/classroom/av_6",
# # # #        "assets/mono/office/av_1",
# # # #        "assets/mono/office/av_2",
# # # #        "assets/mono/office/av_3",
# # # #        "assets/mono/office/av_4",
# # # #        "assets/mono/office/av_5",
# # # #        "assets/mono/office/av_6",
# # # #        "assets/mono/playground/av_1",
# # # #        "assets/mono/playground/av_2",
# # # #        "assets/mono/playground/av_3",
# # # #        "assets/mono/playground/av_4",
# # # #        "assets/mono/playground/av_5",
# # # #        "assets/mono/playground/av_6",
# # # #        "assets/modern/av_1",
# # # #        "assets/modern/av_2",
# # # #        "assets/modern/av_3",
# # # #        "assets/modern/av_4",
# # # #        "assets/modern/av_5",
# # # #        "assets/modern/av_6",
# # # #        "assets/classroom/av_1",
# # # #        "assets/classroom/av_2",
# # # #        "assets/classroom/av_3",
# # # #        "assets/classroom/av_4",
# # # #        "assets/classroom/av_5",
# # # #        "assets/classroom/av_6",
# # # #        "assets/office/av_1",
# # # #        "assets/office/av_2",
# # # #        "assets/office/av_3",
# # # #        "assets/office/av_4",
# # # #        "assets/office/av_5",
# # # #        "assets/office/av_6",
# # # #        "assets/playground/av_1",
# # # #        "assets/playground/av_2",
# # # #        "assets/playground/av_3",
# # # #        "assets/playground/av_4",
# # # #        "assets/playground/av_5",
# # # #        "assets/playground/av_6"
# # # #        ]
# # # #
# # # #
# # # # for path in paths:
# # # #
# # # #     remove_video_audio(path)
# # # # # from moviepy.audio.AudioClip import concatenate_audioclips
# # # # # from moviepy.audio.io.AudioFileClip import AudioFileClip
# # # # # from moviepy.editor import VideoFileClip
# # # # # from moviepy.video.VideoClip import ImageClip
# # # # # from moviepy.video.compositing.CompositeVideoClip import clips_array, CompositeVideoClip
# # # # # from moviepy.video.compositing.concatenate import concatenate_videoclips
# # # # # video1= VideoFileClip("assets/classroom/av_3.mp4")
# # # # # video1_talking = video1.subclip(3, video1.duration - 3)
# # # # #
# # # # #
# # # # #
# # # # # video_clips1 = []
# # # # # frame1=video1_talking.subclip(0, video1_talking.duration - 32)
# # # # # frame1.write_videofile("frame1.mp4")
# # # # # frame2=video1_talking.subclip(video1_talking.duration - 33, video1_talking.duration - 22)
# # # # # frame2.write_videofile("frame2.mp4")
# # # # # frame3=video1_talking.subclip(video1_talking.duration - 22, video1_talking.duration - 11)
# # # # # frame3.write_videofile("frame3.mp4")
# # # # # frame4=video1_talking.subclip(video1_talking.duration - 11, video1_talking.duration)
# # # # # frame4.write_videofile("frame4.mp4")
# # # # # from ai_processing import new_call_language_model
# # # # # import json
# # # # # key = "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"
# # # # # prompt = f"""
# # # # # Extrahieren Sie das wichtigste Schlüsselwort, im JSON-Format Schlüsselwort, daraus:
# # # # # Hast du schon mal von Agilität gehört? Ich habe das Gefühldass sie immer mehr an Bedeutung gewinnt"""
# # # # # new_call_language_model(prompt, key)
# # # #
# # # # # while True:
# # # # #     try :
# # # # #         print(json.loads(new_call_language_model(prompt, key))['Fragen'])
# # # # #         break
# # # # #     except KeyError as e:
# # # # #         print(json.loads(new_call_language_model(prompt, key))['fragen'])
# # # # #         break
# # # # #     except Exception as e:
# # # # #         print(f"An unexpected error occurred: {type(e).__name__}: {e} Retrying...")
# # # #
# # # # from openai import OpenAI
# # # # client = OpenAI(api_key="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")
# # # #
# # # # speech_file_path = "assets/voices/shimmer_voice.mp3"
# # # # # ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
# # # # response = client.audio.speech.create(
# # # #   model="tts-1-hd",
# # # #   voice="shimmer",
# # # #   input="Hallo. Wie geht es dir? Ich bin eine der vielen Stimmen, die in dieser tollen App enthalten sind",
# # # # )
# # # # response.stream_to_file(speech_file_path)
# # # # import requests
# # # #
# # # # api_url = "https://bottalk.io/api/articles"
# # # # api_key = "425946601ca877b3131dd154badb9227"
# # # # headers = {"Authorization": f"Bearer {api_key}"}
# # # #
# # # # # Example GET request
# # # # #response = requests.get(api_url, headers=headers)
# # # #
# # # # # Example POST request with data
# # # # payload = {"title": "test1", "text": "Hallo. Wie geht es dir? Ich bin eine der vielen Stimmen, die in dieser tollen App enthalten sind"}
# # # # response = requests.post(api_url, json=payload, headers=headers)
# # # #
# # # # # Print the response
# # # # print(response.status_code)
# # # # print(response.json())
# # # from tts_processing import synthesize_text
# # # female_voices=["de-DE-Neural2-A","de-DE-Standard-A","de-DE-Standard-C","de-DE-Standard-F","de-DE-Studio-C","de-DE-Wavenet-A","de-DE-Wavenet-F"]
# # # male_voices=["de-DE-Neural2-D","de-DE-Standard-B","de-DE-Standard-D","de-DE-Studio-B","de-DE-Wavenet-B","de-DE-Wavenet-D","de-DE-Wavenet-E"]
# # # for v in female_voices:
# # #     synthesize_text("Agilität ist die Zukunft der Unternehmensführung. Unternehmen müssen sich anpassen und flexibel "
# # #                     "bleiben, um in einer sich ständig verändernden Welt erfolgreich zu sein. Die Fähigkeit, "
# # #                     "schnell zu reagieren und effektiv zu handeln, ist entscheidend, um wettbewerbsfähig zu bleiben "
# # #                     "und langfristigen Erfolg zu erzielen. Daher ist Agilität keine vorübergehende Modeerscheinung, "
# # #                     "sondern eine grundlegende Veränderung, die Unternehmen dringend benötigen.",
# # #                     "assets/voices/females/"+v+".mp3",v,"127.0.0.1")
# # # # for v in male_voices:
# # # #     synthesize_text("Agilität ist die Zukunft der Unternehmensführung. Unternehmen müssen sich anpassen und flexibel "
# # # #                     "bleiben, um in einer sich ständig verändernden Welt erfolgreich zu sein. Die Fähigkeit, "
# # # #                     "schnell zu reagieren und effektiv zu handeln, ist entscheidend, um wettbewerbsfähig zu bleiben "
# # # #                     "und langfristigen Erfolg zu erzielen. Daher ist Agilität keine vorübergehende Modeerscheinung, "
# # # #                     "sondern eine grundlegende Veränderung, die Unternehmen dringend benötigen.",
# # # #                     "assets/voices/males/"+v+".mp3",v,"127.0.0.1")
# # from video_processing import excessive_crop_video_bottm_top, reduce_video_duration
# #
# # mono_paths = ["assets/mono/modern/av_5",
# #               "assets/mono/modern/av_6",
# #
# #
# #               "assets/mono/classroom/av_5",
# #               "assets/mono/classroom/av_6",
# #
# #
# #               "assets/mono/office/av_5",
# #               "assets/mono/office/av_6",
# #
# #
# #               "assets/mono/playground/av_5",
# #               "assets/mono/playground/av_6",
# #
# #               ]
# # for path in mono_paths:
# #     reduce_video_duration(path,43)
# # # from tts_processing import synthesize_text
# # # synthesize_text("Hallo. Wie geht es dir? Ich bin eine der vielen Stimmen, die in dieser tollen App enthalten sind.",
# # #                     "assets/voices/Maja.mp3","de-DE-Neural2-A","127.0.0.1")
# # # from gtts import gTTS
# # #
# # # language = 'de'
# # # mytext = "Hallo. Wie geht es dir? Ich bin eine der vielen Stimmen, die in dieser tollen App enthalten sind."
# # # a = gTTS(text=mytext, lang=language, slow=False)
# # # # a.save("audio.mp3")
# #
# #
# # # from tts_processing import synthesize_text
# # # from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip, concatenate_audioclips
# # # from moviepy.audio.fx.audio_fadein import audio_fadein
# # # from moviepy.audio.fx.audio_fadeout import audio_fadeout
# # # from moviepy.audio.fx.volumex import volumex
# # #
# # # # synthesize_text(
# # # #     "Willkommen zu unserem Podcast! In dieser Folge tauchen wir ein in die faszinierende Welt der Agilität in Unternehmen. Agile Arbeitsweisen sind heutzutage mehr als nur ein Trend – sie sind ein entscheidender Ansatz, um sich an die ständigen Veränderungen in der Geschäftswelt anzupassen. Wir werden die Kernprinzipien von Agile erforschen, von individuellen Interaktionen bis hin zu schneller Anpassungsfähigkeit, und verschiedene agile Methoden wie Scrum und Kanban vorstellen."
# # # #     "sondern eine grundlegende Veränderung, die Unternehmen dringend benötigen.", "speech_audio.mp3",
# # # #     "de-DE-Polyglot-1", "127.0.0.1")
# # # # # Load the speech audio
# # # speech_audio = AudioFileClip("speech_audio.mp3")
# # #
# # # jingle = AudioFileClip("assets/Jingle_final.mp3")
# # # fadein_duration = 0  # Adjust as needed
# # # fadeout_duration = 2  # Adjust as needed
# # # jingle = audio_fadein(jingle, fadein_duration).fx(audio_fadeout, fadeout_duration)
# # # # Load the background music
# # # background_music = AudioFileClip("assets/sunrise-groove-176565.mp3")
# # # background_music = volumex(background_music, 0.02)
# # #
# # # # Adjust the duration of the background music to match the speech audio
# # # background_music = background_music.subclip(0, speech_audio.duration)
# # #
# # # # Apply fade-in and fade-out effects to the background music
# # # fadein_duration = 0  # Adjust as needed
# # # fadeout_duration = 2  # Adjust as needed
# # # background_music = audio_fadein(background_music, fadein_duration).fx(audio_fadeout, fadeout_duration)
# # #
# # # # Combine the speech audio and background music
# # # final_audio = CompositeAudioClip([speech_audio, background_music]).set_fps(background_music.fps)
# # # final_audio = concatenate_audioclips([jingle, final_audio])
# # # # Write the final audio to a file
# # # final_audio.write_audiofile("output_audio.mp3", codec='mp3')
# # # from video_processing import reduce_video_duration,excessive_crop_video_bottm_top
#
# # # excessive_crop_video_bottm_top("assets/modern/av_5")
# #
# # from tts_processing import synthesize_text,synthesize_text_openai
# #
# # pronunciation_dict = {
# #     'A': 'ay',
# #     'B': 'bee',
# #     'C': 'cee',
# #     'D': 'dee',
# #     'E': 'i',
# #     'F': 'f',
# #     'G': 'jee',
# #     'H': 'aysh',
# #     'I': 'eye',
# #     'J': 'jay',
# #     'K': 'kay',
# #     'L': 'el',
# #     'M': 'm',
# #     'N': 'n',
# #     'O': 'oh',
# #     'P': 'pee',
# #     'Q': 'cue',
# #     'R': 'ar',
# #     'S': 'ess',
# #     'T': 'tee',
# #     'U': 'you',
# #     'V': 'vee',
# #     'W': 'dable you',
# #     'X': 'ecks',
# #     'Y': 'why',
# #     'Z': 'ze',
# # }
# # abbreviation = {
# #     "IT": " ".join([pronunciation_dict[char] for char in "IT"]),  # Information Technology
# #     "ID": " ".join([pronunciation_dict[char] for char in "ID"]),  # Identification
# #     "CEO": " ".join([pronunciation_dict[char] for char in "CEO"]),  # Chief Executive Officer
# #     "CFO": " ".join([pronunciation_dict[char] for char in "CFO"]),  # Chief Financial Officer
# #     "CTO": " ".join([pronunciation_dict[char] for char in "CTO"]),  # Chief Technology Officer
# #     "FAQ": " ".join([pronunciation_dict[char] for char in "FAQ"]),  # Frequently Asked Questions
# #     "GPS": " ".join([pronunciation_dict[char] for char in "GPS"]),  # Global Positioning System
# #     "URL": " ".join([pronunciation_dict[char] for char in "URL"]),  # Uniform Resource Locator
# #     "LAN": " ".join([pronunciation_dict[char] for char in "LAN"]),  # Local Area Network
# #     "WLAN": " ".join([pronunciation_dict[char] for char in "WLAN"]),  # Wireless Local Area Network
# #     "AI": " ".join([pronunciation_dict[char] for char in "AI"]),  # Artificial Intelligence
# #     "HTML": " ".join([pronunciation_dict[char] for char in "HTML"]),  # Hypertext Markup Language
# #     "CSS": " ".join([pronunciation_dict[char] for char in "CSS"]),  # Cascading Style Sheets
# #     "HTTP": " ".join([pronunciation_dict[char] for char in "HTTP"]),  # Hypertext Transfer Protocol
# #     "HTTPS": " ".join([pronunciation_dict[char] for char in "HTTPS"]),  # Hypertext Transfer Protocol Secure
# #     "SMTP": " ".join([pronunciation_dict[char] for char in "SMTP"]),  # Simple Mail Transfer Protocol
# #     "PDF": " ".join([pronunciation_dict[char] for char in "PDF"]),  # Portable Document Format
# #     "JPEG": " ".join([pronunciation_dict[char] for char in "JPEG"]),  # Joint Photographic Experts Group
# #     "USB": " ".join([pronunciation_dict[char] for char in "USB"]),  # Universal Serial Bus
# #     "LCD": " ".join([pronunciation_dict[char] for char in "LCD"]),  # Liquid Crystal Display
# #     "LED": " ".join([pronunciation_dict[char] for char in "LED"]),  # Light Emitting Diode
# #     "RAM": " ".join([pronunciation_dict[char] for char in "RAM"]),  # Random Access Memory
# #     "CPU": " ".join([pronunciation_dict[char] for char in "CPU"]),  # Central Processing Unit
# #     "GPU": " ".join([pronunciation_dict[char] for char in "GPU"]),  # Graphics Processing Unit
# #     "DNS": " ".join([pronunciation_dict[char] for char in "DNS"]),  # Domain Name System
# #     "FTP": " ".join([pronunciation_dict[char] for char in "FTP"]),  # File Transfer Protocol
# #     "VPN": " ".join([pronunciation_dict[char] for char in "VPN"]),  # Virtual Private Network
# #     "SSD": " ".join([pronunciation_dict[char] for char in "SSD"]),  # Solid State Drive
# #     "HDD": " ".join([pronunciation_dict[char] for char in "HDD"]),  # Hard Disk Drive
# #     "ISP": " ".join([pronunciation_dict[char] for char in "ISP"]),  # Internet Service Provider
# #     "OS": " ".join([pronunciation_dict[char] for char in "OS"]),  # Operating System
# #     "SSL": " ".join([pronunciation_dict[char] for char in "SSL"]),  # Secure Sockets Layer
# #     "TLS": " ".join([pronunciation_dict[char] for char in "TLS"]),  # Transport Layer Security
# #     "HTML5": " ".join([pronunciation_dict[char] for char in "HTML"]),  # Hypertext Markup Language version 5
# #     "API": " ".join([pronunciation_dict[char] for char in "API"]),  # Application Programming Interface
# #     "SDK": " ".join([pronunciation_dict[char] for char in "SDK"]),  # Software Development Kit
# #     "URL": " ".join([pronunciation_dict[char] for char in "URL"]),  # Uniform Resource Locator
# #     "IoT": " ".join([pronunciation_dict[char] for char in "IOT"]),  # Internet of Things
# #     "VoIP": " ".join([pronunciation_dict[char] for char in "VOIP"]),  # Voice over Internet Protocol
# #     "XML": " ".join([pronunciation_dict[char] for char in "XML"]),  # eXtensible Markup Language
# #     "JSON": " ".join([pronunciation_dict[char] for char in "JSON"]),  # JavaScript Object Notation
# #     "SQL": " ".join([pronunciation_dict[char] for char in "SQL"]),  # Structured Query Language
# #     "SaaS": " ".join([pronunciation_dict[char] for char in "SAAS"]),  # Software as a Service
# #     "PaaS": " ".join([pronunciation_dict[char] for char in "PAAS"]),  # Platform as a Service
# #     "IaaS": " ".join([pronunciation_dict[char] for char in "IAAS"]),  # Infrastructure as a Service
# #     "RFID": " ".join([pronunciation_dict[char] for char in "RFID"]),  # Radio-Frequency Identification
# #     "NFC": " ".join([pronunciation_dict[char] for char in "NFC"]),  # Near Field Communication
# #     "BI": " ".join([pronunciation_dict[char] for char in "BI"]),  # Business Intelligence
# #     "CRM": " ".join([pronunciation_dict[char] for char in "CRM"]),  # Customer Relationship Management
# #     "ERP": " ".join([pronunciation_dict[char] for char in "ERP"]),  # Enterprise Resource Planning
# #     "API": " ".join([pronunciation_dict[char] for char in "API"]),  # Application Programming Interface
# #     "DNS": " ".join([pronunciation_dict[char] for char in "DNS"]),  # Domain Name System
# #     "SDK": " ".join([pronunciation_dict[char] for char in "SDK"]),  # Software Development Kit
# #     "UX": " ".join([pronunciation_dict[char] for char in "UX"]),  # User Experience
# #     "UI": " ".join([pronunciation_dict[char] for char in "UI"]),  # User Interface
# #     "CMS": " ".join([pronunciation_dict[char] for char in "CMS"]),  # Content Management System
# #     "MVP": " ".join([pronunciation_dict[char] for char in "MVP"]),  # Minimum Viable Product
# #     "QA": " ".join([pronunciation_dict[char] for char in "QA"]),  # Quality Assurance
# #     "IoT": " ".join([pronunciation_dict[char] for char in "IOT"]),  # Internet of Things
# #     "AR": " ".join([pronunciation_dict[char] for char in "AR"]),  # Augmented Reality
# #     "VR": " ".join([pronunciation_dict[char] for char in "VR"]),  # Virtual Reality
# #     "MR": " ".join([pronunciation_dict[char] for char in "MR"]),  # Mixed Reality
# #     "GDPR": " ".join([pronunciation_dict[char] for char in "GDPR"]),  # General Data Protection Regulation
# # }
# #
# # open_ai_pronunciation_dict = {
# #     'A': 'ay',
# #     'B': 'bee',
# #     'C': 'see',
# #     'D': 'dee',
# #     'E': 'ee',
# #     'F': 'eff',
# #     'G': 'jee',
# #     'H': 'aysh',
# #     'I': 'eye',
# #     'J': 'jay',
# #     'K': 'kay',
# #     'L': 'el',
# #     'M': 'em',
# #     'N': 'n',
# #     'O': 'oh',
# #     'P': 'pee',
# #     'Q': 'cue',
# #     'R': 'ar',
# #     'S': 'ess',
# #     'T': 'tee',
# #     'U': 'you',
# #     'V': 'vee',
# #     'W': 'dable you',
# #     'X': 'ecks',
# #     'Y': 'why',
# #     'Z': 'zee',
# # }
# # open_ai_abbreviation = {
# #     "IT": " ".join([open_ai_pronunciation_dict[char] for char in "IT"]),  # Information Technology
# #     "ID": " ".join([open_ai_pronunciation_dict[char] for char in "ID"]),  # Identification
# #     "CEO": " ".join([open_ai_pronunciation_dict[char] for char in "CEO"]),  # Chief Executive Officer
# #     "CFO": " ".join([open_ai_pronunciation_dict[char] for char in "CFO"]),  # Chief Financial Officer
# #     "CTO": " ".join([open_ai_pronunciation_dict[char] for char in "CTO"]),  # Chief Technology Officer
# #     "FAQ": " ".join([open_ai_pronunciation_dict[char] for char in "FAQ"]),  # Frequently Asked Questions
# #     "GPS": " ".join([open_ai_pronunciation_dict[char] for char in "GPS"]),  # Global Positioning System
# #     "URL": " ".join([open_ai_pronunciation_dict[char] for char in "URL"]),  # Uniform Resource Locator
# #     "LAN": " ".join([open_ai_pronunciation_dict[char] for char in "LAN"]),  # Local Area Network
# #     "WLAN": " ".join([open_ai_pronunciation_dict[char] for char in "WLAN"]),  # Wireless Local Area Network
# #     "AI": " ".join([open_ai_pronunciation_dict[char] for char in "AI"]),  # Artificial Intelligence
# #     "HTML": " ".join([open_ai_pronunciation_dict[char] for char in "HTML"]),  # Hypertext Markup Language
# #     "CSS": " ".join([open_ai_pronunciation_dict[char] for char in "CSS"]),  # Cascading Style Sheets
# #     "HTTP": " ".join([open_ai_pronunciation_dict[char] for char in "HTTP"]),  # Hypertext Transfer Protocol
# #     "HTTPS": " ".join([open_ai_pronunciation_dict[char] for char in "HTTPS"]),  # Hypertext Transfer Protocol Secure
# #     "SMTP": " ".join([open_ai_pronunciation_dict[char] for char in "SMTP"]),  # Simple Mail Transfer Protocol
# #     "PDF": " ".join([open_ai_pronunciation_dict[char] for char in "PDF"]),  # Portable Document Format
# #     "JPEG": " ".join([open_ai_pronunciation_dict[char] for char in "JPEG"]),  # Joint Photographic Experts Group
# #     "USB": " ".join([open_ai_pronunciation_dict[char] for char in "USB"]),  # Universal Serial Bus
# #     "LCD": " ".join([open_ai_pronunciation_dict[char] for char in "LCD"]),  # Liquid Crystal Display
# #     "LED": " ".join([open_ai_pronunciation_dict[char] for char in "LED"]),  # Light Emitting Diode
# #     "RAM": " ".join([open_ai_pronunciation_dict[char] for char in "RAM"]),  # Random Access Memory
# #     "CPU": " ".join([open_ai_pronunciation_dict[char] for char in "CPU"]),  # Central Processing Unit
# #     "GPU": " ".join([open_ai_pronunciation_dict[char] for char in "GPU"]),  # Graphics Processing Unit
# #     "DNS": " ".join([open_ai_pronunciation_dict[char] for char in "DNS"]),  # Domain Name System
# #     "FTP": " ".join([open_ai_pronunciation_dict[char] for char in "FTP"]),  # File Transfer Protocol
# #     "VPN": " ".join([open_ai_pronunciation_dict[char] for char in "VPN"]),  # Virtual Private Network
# #     "SSD": " ".join([open_ai_pronunciation_dict[char] for char in "SSD"]),  # Solid State Drive
# #     "HDD": " ".join([open_ai_pronunciation_dict[char] for char in "HDD"]),  # Hard Disk Drive
# #     "ISP": " ".join([open_ai_pronunciation_dict[char] for char in "ISP"]),  # Internet Service Provider
# #     "OS": " ".join([open_ai_pronunciation_dict[char] for char in "OS"]),  # Operating System
# #     "SSL": " ".join([open_ai_pronunciation_dict[char] for char in "SSL"]),  # Secure Sockets Layer
# #     "TLS": " ".join([open_ai_pronunciation_dict[char] for char in "TLS"]),  # Transport Layer Security
# #     "HTML5": " ".join([open_ai_pronunciation_dict[char] for char in "HTML"]),  # Hypertext Markup Language version 5
# #     "API": " ".join([open_ai_pronunciation_dict[char] for char in "API"]),  # Application Programming Interface
# #     "SDK": " ".join([open_ai_pronunciation_dict[char] for char in "SDK"]),  # Software Development Kit
# #     "URL": " ".join([open_ai_pronunciation_dict[char] for char in "URL"]),  # Uniform Resource Locator
# #     "IoT": " ".join([open_ai_pronunciation_dict[char] for char in "IOT"]),  # Internet of Things
# #     "VoIP": " ".join([open_ai_pronunciation_dict[char] for char in "VOIP"]),  # Voice over Internet Protocol
# #     "XML": " ".join([open_ai_pronunciation_dict[char] for char in "XML"]),  # eXtensible Markup Language
# #     "JSON": " ".join([open_ai_pronunciation_dict[char] for char in "JSON"]),  # JavaScript Object Notation
# #     "SQL": " ".join([open_ai_pronunciation_dict[char] for char in "SQL"]),  # Structured Query Language
# #     "SaaS": " ".join([open_ai_pronunciation_dict[char] for char in "SAAS"]),  # Software as a Service
# #     "PaaS": " ".join([open_ai_pronunciation_dict[char] for char in "PAAS"]),  # Platform as a Service
# #     "IaaS": " ".join([open_ai_pronunciation_dict[char] for char in "IAAS"]),  # Infrastructure as a Service
# #     "RFID": " ".join([open_ai_pronunciation_dict[char] for char in "RFID"]),  # Radio-Frequency Identification
# #     "NFC": " ".join([open_ai_pronunciation_dict[char] for char in "NFC"]),  # Near Field Communication
# #     "BI": " ".join([open_ai_pronunciation_dict[char] for char in "BI"]),  # Business Intelligence
# #     "CRM": " ".join([open_ai_pronunciation_dict[char] for char in "CRM"]),  # Customer Relationship Management
# #     "ERP": " ".join([open_ai_pronunciation_dict[char] for char in "ERP"]),  # Enterprise Resource Planning
# #     "API": " ".join([open_ai_pronunciation_dict[char] for char in "API"]),  # Application Programming Interface
# #     "DNS": " ".join([open_ai_pronunciation_dict[char] for char in "DNS"]),  # Domain Name System
# #     "SDK": " ".join([open_ai_pronunciation_dict[char] for char in "SDK"]),  # Software Development Kit
# #     "UX": " ".join([open_ai_pronunciation_dict[char] for char in "UX"]),  # User Experience
# #     "UI": " ".join([open_ai_pronunciation_dict[char] for char in "UI"]),  # User Interface
# #     "CMS": " ".join([open_ai_pronunciation_dict[char] for char in "CMS"]),  # Content Management System
# #     "MVP": " ".join([open_ai_pronunciation_dict[char] for char in "MVP"]),  # Minimum Viable Product
# #     "QA": " ".join([open_ai_pronunciation_dict[char] for char in "QA"]),  # Quality Assurance
# #     "IoT": " ".join([open_ai_pronunciation_dict[char] for char in "IOT"]),  # Internet of Things
# #     "AR": " ".join([open_ai_pronunciation_dict[char] for char in "AR"]),  # Augmented Reality
# #     "VR": " ".join([open_ai_pronunciation_dict[char] for char in "VR"]),  # Virtual Reality
# #     "MR": " ".join([open_ai_pronunciation_dict[char] for char in "MR"]),  # Mixed Reality
# #     "GDPR": " ".join([open_ai_pronunciation_dict[char] for char in "GDPR"]),  # General Data Protection Regulation
# # }
# # # "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
# # paragraph = "Willkommen zu unserem Podcast! ERP systems"
# # for key, value in abbreviation.items():
# #     paragraph = paragraph.replace(key, value)
# # print(paragraph)
# #
# # # pronunciation = [pronunciation_dict[letter.upper()] for letter in word]
# # # open_ai_pronunciation = [open_ai_pronunciation_dict[letter.upper()] for letter in word]
# #
# #
# #
# # synthesize_text(
# #     paragraph, "speech_audio.mp3",
# #     "de-DE-Polyglot-1", "127.0.0.1")
# # synthesize_text_openai(
# #     paragraph, "speech_audio2.mp3",
# #     "echo", "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")
# # from tts_processing import synthesize_text, synthesize_text_openai
# # synthesize_text_openai(
# #     "Explain, podcast", "speech_audio0.mp3",
# #     "fable", "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")
# # from video_processing import crop_video_bottm_right, crop_video_bottm_left, reduce_video_duration
# #
# # dual_paths = [
# #
# #     "assets/modern/av_5",
# #
# #     "assets/classroom/av_5",
# #
# #     "assets/office/av_5",
# #
# #     "assets/playground/av_5",
# #
# # ]
# # for p in dual_paths:
# #     crop_video_bottm_left(p)
# #     crop_video_bottm_right(p)
# from tts_processing import synthesize_text, synthesize_text_openai
#
# # primary voices english
# synthesize_text(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Bernd_en-US.mp3",
#     "en-US-Journey-D", "127.0.0.1","en-US")
# synthesize_text(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Klarissa_en-US.mp3",
#     "en-US-Journey-F", "127.0.0.1","en-US")
# synthesize_text(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Elke_en-US.mp3",
#     "en-US-Neural2-H", "127.0.0.1","en-US")
# synthesize_text(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Maja_en-US.mp3",
#     "en-US-Neural2-C", "127.0.0.1","en-US")
#
# synthesize_text(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Conrad_en-US.mp3",
#     "en-US-Neural2-D", "127.0.0.1","en-US")
#
# synthesize_text(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Kasper_en-US.mp3",
#     "en-US-Neural2-I", "127.0.0.1","en-US")
#
#
# # secondary voices english
# synthesize_text(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Elke_0_en-US.mp3",
#     "en-US-Studio-O", "127.0.0.1","en-US")
# synthesize_text_openai(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Conrad_0_en-US.mp3",
#     "alloy", "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")
# synthesize_text_openai(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Bernd_0_en-US.mp3",
#     "echo", "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")
# synthesize_text_openai(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Kasper_0_en-US.mp3",
#     "onyx", "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")
# synthesize_text_openai(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Klarissa_0_en-US.mp3",
#     "nova", "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")
# synthesize_text_openai(
#     "Hello. How are you doing? I am one of the many voices included in this amazing app", "Maja_0_en-US.mp3",
#     "shimmer", "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")
#
#
# # primary voices arabic
# synthesize_text(
#     "مرحباً. كيف حالك؟ أنا واحد من الأصوات العديدة الموجودة في هذا التطبيق المذهل", "Bernd_ar-XA.mp3",
#     "ar-XA-Standard-C", "127.0.0.1","ar-XA")
# synthesize_text(
#     "مرحباً. كيف حالك؟ أنا واحد من الأصوات العديدة الموجودة في هذا التطبيق المذهل", "Klarissa_ar-XA.mp3",
#     "ar-XA-Standard-D", "127.0.0.1","ar-XA")
# synthesize_text(
#     "مرحباً. كيف حالك؟ أنا واحد من الأصوات العديدة الموجودة في هذا التطبيق المذهل", "Conrad_ar-XA.mp3",
#     "ar-XA-Standard-B", "127.0.0.1","ar-XA")
# synthesize_text(
#     "مرحباً. كيف حالك؟ أنا واحد من الأصوات العديدة الموجودة في هذا التطبيق المذهل", "Elke_ar-XA.mp3",
#     "ar-XA-Standard-A", "127.0.0.1","ar-XA")
#
# synthesize_text(
#     "مرحباً كيف حالك أنا واحد من الأصوات العديدة الموجودة في هذا التطبيق المذهل", "Maja_ar-XA.mp3",
#     "ar-XA-Wavenet-D", "127.0.0.1","ar-XA")
# synthesize_text(
#     "مرحباً كيف حالك أنا واحد من الأصوات العديدة الموجودة في هذا التطبيق المذهل", "Kasper_ar-XA.mp3",
#     "ar-XA-Wavenet-C", "127.0.0.1","ar-XA")
#
# # primary voices french
# synthesize_text(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Bernd_fr-FR.mp3",
#     "fr-FR-Neural2-B", "127.0.0.1","fr-FR")
# synthesize_text(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Klarissa_fr-FR.mp3",
#     "fr-FR-Neural2-A", "127.0.0.1","fr-FR")
# synthesize_text(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Conrad_fr-FR.mp3",
#     "fr-FR-Neural2-D", "127.0.0.1","fr-FR")
# synthesize_text(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Elke_fr-FR.mp3",
#     "fr-FR-Neural2-E", "127.0.0.1","fr-FR")
# synthesize_text(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Maja_fr-FR.mp3",
#     "fr-FR-Studio-A", "127.0.0.1","fr-FR")
# synthesize_text(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Kasper_fr-FR.mp3",
#     "fr-FR-Studio-D", "127.0.0.1","fr-FR")
#
#
#
# # secondary voices french
#
# synthesize_text(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Elke_0_fr-FR.mp3",
#     "fr-FR-Neural2-C", "127.0.0.1","fr-FR")
# synthesize_text_openai(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Conrad_0_fr-FR.mp3",
#     "alloy", "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")
# synthesize_text_openai(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Bernd_0_fr-FR.mp3",
#     "echo", "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")
# synthesize_text_openai(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Kasper_0_fr-FR.mp3",
#     "onyx", "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")
# synthesize_text_openai(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Klarissa_0_fr-FR.mp3",
#     "nova", "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")
# synthesize_text_openai(
#     "Bonjour. Comment vas-tu? Je suis l'une des nombreuses voix de cette application incroyable", "Maja_0_fr-FR.mp3",
#     "shimmer", "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")

import PyPDF2


def bookmark_dict(bookmark_list):
    result = []
    for index,item in enumerate(bookmark_list):
        if isinstance(item, list):
            # recursive call
            print("no bookmark")
            # result.update(bookmark_dict(item))
        else:
            page_num = reader.get_destination_page_number(item)
            page = reader.pages[page_num]
            text = page.extract_text()
            # result[item.title] = text
            result.append({"title":item.title,"text":text,"page":page_num})


    return result
def extract_pdf_content(pdf_reader):
    content = ""
    for page_number in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_number]
        content += page.extract_text()

    return content


reader = PyPDF2.PdfReader("your_pdf_file.pdf")
# print(extract_pdf_content(reader))
print(bookmark_dict(reader.outline))
