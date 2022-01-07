from flask import Flask, request,render_template, redirect, jsonify, Response
import pandas as pd
import numpy as np
from config import API_TOKEN


# from flask_restplus import Api
# api = Api()

df = pd.read_csv('SinglishToEnglish.csv')

app = Flask(__name__)
# api.init_app(app)

import requests


@app.route('/',methods=['POST', 'GET'])
def tired():
    return redirect('/api')

@app.route('/api',methods=['POST', 'GET'])
@app.route('/api/<name>',methods=['POST', 'GET'])
def home(name='hello'):
    sent = name
    if request.method=='POST':
        # sent = str(request.form['clickbaitText'])
        sent = name
        no_punc = remove_punctuations(sent)
        no_singlish = singlish_to_english(no_punc)
        sentences = to_sent(no_singlish)
        sent = rephrase(sentences)
        return Response({'rephrased': sent}, status=201, mimetype='application/json')

    return render_template("index.html",sentence=sent)

# @api.route()

@app.route('/returnjson', methods = ['GET'])
def ReturnJSON():
    if(request.method == 'GET'):
        sent = 'brb i need to check smth, btw the meeting tmr i need to come or nt ah'
        no_punc = remove_punctuations(sent)
        no_singlish = singlish_to_english(no_punc)
        sentences = to_sent(no_singlish)
        sent = rephrase(sentences)

        data = {
            "rephrased" : sent
        }
  
        return jsonify(data)

def remove_punctuations(text):
    punc = ['"', '.', ',', '!', '(', ')']
    special = ['#', '@', '&', '/']

    sentences = []
    j = 0
    subsent = '' 
    while j < len(text):
        char = text[j]
        #   removing special char n punctuations, append as separate
        if char in punc:
            if subsent != '' and not subsent.isspace():
                sentences.append(subsent)
                subsent = ''
            j += 1
        elif char in special:
            if char == '#':
                sentences.append(subsent)
                subsent = ''
                j += 1
                while char != ' ':
                    j += 1
            elif char == '@':
                subsent += 'at'
            elif char == '&':
                subsent += 'and'
            elif char == '/':
                subsent += 'or'
            j += 1
        else:
            subsent += char
            j += 1
    if subsent != '' and not subsent.isspace():
        sentences.append(subsent)
    return sentences

def singlish_to_english(sentence):
    corrected_sent = []
    # for sentence in sentences:
    if len(sentence)==1:
        sentence = sentence[0].split()
        i = 0
        while i < len(sentence):
            sentence[i]= sentence[i].lower()
            row = df.loc[df['Singlish'] == sentence[i]]
            if row.size == 0:
                if len(sentence[i]) > 1:
                    row = df[df['Singlish'].str.contains(sentence[i])]
            if row.size != 0:
                sentence[i] = row['English'].values[0]
                singlish_length = len(row['Singlish'].values[0].split())
                if singlish_length > 1:
                    for j in range(singlish_length-1):
                        sentence.pop(i+1)
            i += 1
        print('corrected',sentence)
        corrected_sent.append(sentence)
    else:
        # for sentences tht r broken up
        for phrase in sentence:
            corrected_phrase = []
            words = phrase.split()
            for i in range(0,len(words)):
                words[i] = words[i].lower()
                row = df.loc[df['Singlish'] == words[i]]
                if row.size == 0 and i < len(words)-1:
                    check = words[i]+' '+words[i+1]
                    row = df.loc[df['Singlish'] == check]
                if row.size != 0:
                    words[i] = row['English'].values[0]
                corrected_phrase.append(words[i])
            corrected_sent.append(corrected_phrase)
    return corrected_sent

def to_sent(sent):
    final_sents = []
    for sentence in sent:
        sentence = " ".join(sentence)
        final_sents.append(sentence)
    return final_sents

def rephrase(final_sents):
    final = []

    API_URL = "https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase"
    headers = {"Authorization": API_TOKEN}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()

    for i in range(0,len(final_sents)):
        output = query({"inputs": final_sents[i]})
        final.append(output[0]['generated_text'])
        
    return final

if __name__ == "__main__":
    app.run()