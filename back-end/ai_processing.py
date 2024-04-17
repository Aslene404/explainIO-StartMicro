from openai import OpenAI
import pathlib
import textwrap

import google.generativeai as genai


def call_language_model(prompt, key):
    client = OpenAI(api_key=key)
    chat_completion = client.chat.completions.create(model="gpt-3.5-turbo-16k",
                                                     messages=[{"role": "user", "content": prompt}])

    # print the chat completion
    # print(chat_completion.choices[0].message.content)
    # Extract and print the response text

    if chat_completion:
        print(chat_completion.choices[0].message.content)
        # print(response['choices'][0]['text'])
        return chat_completion.choices[0].message.content.strip()
        # return response.choices[0].message.content
    # else:
    #     print(f"Error: {response.status_code} - {response.text}")
    #     return None


def new_call_language_model(prompt, key):
    client = OpenAI(api_key=key)

    chat_completion = client.chat.completions.create(model="gpt-3.5-turbo-0125", temperature=0.2,
                                                     messages=[{"role": "user", "content": prompt}])

    # print the chat completion
    # print(chat_completion.choices[0].message.content)
    # Extract and print the response text

    if chat_completion:
        print(chat_completion.choices[0].message.content)
        # print(response['choices'][0]['text'])
        return chat_completion.choices[0].message.content.strip()
        # return response.choices[0].message.content
    # else:
    #     print(f"Error: {response.status_code} - {response.text}")
    #     return None


def google_call_language_model(prompt, key):
    genai.configure(api_key=key)

    # for m in genai.list_models():
    #   if 'generateContent' in m.supported_generation_methods:
    #     print(m.name)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    print(response.text)
    return response.text
