from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os

def get_answer(text, question):
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are an assistant helping answer user questions based on the following PDF content:

Context:
{context}

Question:
{question}

Answer:
""",
    )

    llm = ChatOpenAI(
        model="deepseek/deepseek-chat-v3-0324:free",  # ✅ Valid free model
        api_key=os.getenv("OPENROUTER_API_KEY", "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"),
        base_url="https://openrouter.ai/api/v1",
        temperature=0
    )

    chain = LLMChain(llm=llm, prompt=prompt)
    return chain.run({"context": text, "question": question})
