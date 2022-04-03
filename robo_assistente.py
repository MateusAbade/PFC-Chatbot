from chatterbot import ChatBot


def executar_robo():
    robo = ChatBot("Robô", storage_adapter='chatterbot.storage.SQLStorageAdapter',
     logic_adapters=["chatterbot.logic.BestMatch"],
     database_uri='postgres://postgres:park22@localhost/bot'
    
    )


    while True:
        entrada = input("digite algo...\n")
        resposta = robo.get_response(entrada.upper())

        if float(resposta.confidence) >0.5:
            print(resposta.text)
            print(resposta.confidence)
        else:
            print(resposta.confidence)
            print("Poxa! no momento ainda não sei como te responder, mas você pode fazer outra pergunta...")
if __name__ == "__main__":
    executar_robo()
    