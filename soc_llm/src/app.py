import json
from flask import Flask, request, jsonify
from langchain_core.load import loads
from langchain_core.prompts import ChatPromptTemplate
from local_models import CustomLLM, CustomOllamaEmbeddings

app = Flask(__name__)

def generate_answer(question):
    with open("/path/to/your/chain.json", "r") as file:
        string_representation = file.read()

    chain = loads(string_representation)
    return json.loads(chain.invoke(question))

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()

    if 'question' not in data:
        return jsonify({'error': 'Вопрос не задан.'}), 400
    
    question = data['question']
    model = CustomLLM()

    embeddings = CustomOllamaEmbeddings()

    prmt = ChatPromptTemplate.from_template(
        "{text}"
    )

    chain = prmt | model

    answer = chain.invoke({'text': question})
    # answer = generate_answer(question)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)