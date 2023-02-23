import requests
import spacy
import sys
import json

if len(sys.argv) < 1:
    exit('usage: extract-topic path_to_json')
if not sys.argv[1].endswith('json'):
    exit('usage: extract-topic path_to_json')

def analyze_webpage_content(url, topics, nlp):
        # Get the HTML content of the webpage
        response = requests.get(url)
        html = response.text
        
        # Parse the HTML content using spaCy
        doc = nlp(html)
        
        # Extract the main topics from the text content
        topics_in_doc = []
        for token in doc:
            if token.lemma_.lower() in topics and not token.is_stop and not token.is_punct:
                topics_in_doc.append(token.lemma_.lower())
        
        # Return the list of matching topics
        return list(set(topics_in_doc))

def read_file(path):
    with open(path, 'r') as f:
        data = json.load(f)
        return data

def extract_topic(path, topics, nlp):
    with open(path, 'r') as f:
        messages = json.load(f)

        for m in messages:
            for l in m['link']:
                link_topics = ''
                if 'youtube' in l or 'youtu.be' in l:
                    link_topics = 'video'
                elif 'discord.com' in l:
                    link_topics = 'discord message'
                else:
                    link_topics = analyze_webpage_content(l, topics, nlp)
                m['topic'].append(link_topics)
    return messages

def to_mardown(path, json):
    template='''
```message
Link: {link}
Message: {msg}
Link_Message: {l_msg}
Author: {author}
Date: {date}
Topic: {topic}
```
'''
    with open(path, "a")as f:
        f.write('# Messages - Dysnome Server\n')
        for m in json:
            f.write(template.format(
                link=m['link'],
                msg=m['message'],
                l_msg=m['link_message'],
                author=m['author'],
                date=m['date'],
                topic=m['topic']
                ))
        
        

if __name__ == "__main__":
    nlp = spacy.load("en_core_web_sm")
    topics = ['certifications', 'windows', 'writeup', 'red-team', 'blue-team', 'pwn', 'stegano', 'containers', 'reverse', 'web', 'iot-smart-devices', 'crypto', 'blockchains', 'linux', 'mobile', 'network', 'osint', 'cloud', 'software-engineering', 'team-management', 'government-risk-compliance', 'note-taking']
    to_mardown(sys.argv[1][:-4] + 'md', extract_topic(sys.argv[1], topics, nlp))
    print('finish !')