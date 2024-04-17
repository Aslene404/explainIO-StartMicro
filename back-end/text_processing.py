import re

import spacy
from spacy.cli.download import download


class ConversationPair:
    def __init__(self, line1, line2):
        self.personA = line1
        self.personB = line2


def remove_duplicates(questions):
    seen_questions = set()
    unique_questions = []

    for question_dict in questions:
        question = question_dict["question"]

        if question not in seen_questions:
            seen_questions.add(question)
            unique_questions.append(question_dict)

    return unique_questions


def has_duplicates(arr):
    seen = set()
    for item in arr:
        if item in seen:
            return True
        seen.add(item)
    return False


conversation = """
Person A: Hallo! Wie geht es dir?
Person B: Mir geht es gut, danke! Und dir?
Person A: Auch gut, danke! Was hast du heute vor?
Person B: Ich habe einen Arzttermin und danach treffe ich mich mit Freunden. Und du?
Person A: Ich muss einkaufen und dann etwas arbeiten.
Person B: Klingt nach einem vollen Tag. Viel Erfolg!
Person A: Danke! Dir auch viel Spaß bei deinem Treffen!
"""


def split_conversation(conversation):
    # Split the conversation into individual lines
    lines = conversation.strip().split('\n')

    # Create a list of conversation pairs
    conversation_pairs = []
    # Create conversation pairs and add them to the list
    for i in range(0, len(lines), 2):

        if i + 1 < len(lines):
            if ":" in lines[i]:
                parts = lines[i].split(":")
                lines[i] = parts[1]
            if ":" in lines[i + 1]:
                parts = lines[i + 1].split(":")
                lines[i + 1] = parts[1]
            pair = ConversationPair(lines[i].strip(), lines[i + 1].strip())
            conversation_pairs.append(pair)
        else:
            if ":" in lines[i]:
                parts = lines[i].split(":")
                lines[i] = parts[1]
            pair = ConversationPair(lines[i].strip(), "")
            conversation_pairs.append(pair)
    return conversation_pairs


def remove_empty_lines(input_string):
    lines = input_string.splitlines()
    non_empty_lines = [line for line in lines if line.strip() != ""]
    return "\n".join(non_empty_lines)


def estimate_tts_time_dual(text, speech_rate=66):
    """
    Estimate the time it takes for a TTS system to say a specific text.

    Parameters:
    - text (str): The input text to be synthesized.
    - speech_rate (int): Average speech rate in words per minute. Default is 150.

    Returns:
    - float: Estimated time in seconds.
    """
    # Count the number of words in the text
    words = text.split()
    word_count = len(words)

    # Calculate the estimated time in seconds
    time_seconds = (word_count / speech_rate) * 60

    # Convert seconds to minutes and seconds
    minutes = int(time_seconds // 60)
    seconds = int(time_seconds % 60)

    return minutes, seconds, time_seconds


def adjust_speech_rate(text, target_time_seconds):
    """
    Adjust the speech rate to achieve a target time for TTS to say a specific text.

    Parameters:
    - text (str): The input text to be synthesized.
    - target_time_seconds (float): Target time in seconds.

    Returns:
    - int: Adjusted speech rate in words per minute.
    """
    # Count the number of words in the text
    words = text.split()
    word_count = len(words)

    # Calculate the adjusted speech rate to achieve the target time
    adjusted_speech_rate = (word_count / target_time_seconds) * 60

    return int(adjusted_speech_rate)


def estimate_tts_time_mono(text, speech_rate=153):
    """
    Estimate the time it takes for a TTS system to say a specific text.

    Parameters:
    - text (str): The input text to be synthesized.
    - speech_rate (int): Average speech rate in words per minute. Default is 150.

    Returns:
    - float: Estimated time in seconds.
    """
    # Count the number of words in the text
    words = text.split()
    word_count = len(words)

    # Calculate the estimated time in seconds
    time_seconds = (word_count / speech_rate) * 60
    # Convert seconds to minutes and seconds
    minutes = int(time_seconds // 60)
    seconds = int(time_seconds % 60)

    return minutes, seconds, time_seconds


def reduce_to_tokens(input_text,lang,isquestions=False):
    if lang=="xx_ent_wiki_sm" and isquestions==False:
        reduction_amount=1500
    elif lang=="xx_ent_wiki_sm" and isquestions:
        reduction_amount = 300
    elif isquestions:
        reduction_amount = 1500
    else:
        reduction_amount=9500
    if lang not in spacy.util.get_installed_models():
        print(lang)
        download(lang)
    nlp = spacy.load(lang)

    # Tokenize the input text
    doc = nlp(input_text)

    # Get the tokens
    tokens = [token.text for token in doc]

    # Check if reduction is necessary
    if len(tokens) > reduction_amount:
        print(f"Reducing tokens to {reduction_amount}.")

        # Get the first `target_token_count` tokens and join them into a reduced text
        reduced_text = ' '.join(tokens[:reduction_amount])
        return reduced_text

    else:
        # No reduction needed, return the original text
        return input_text
    
# print(spacy.util.get_installed_models())





