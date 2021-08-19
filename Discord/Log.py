import datetime

def discord_log(msg):
    print(f'{datetime.datetime.now()}: {msg}')
    f = open("DiscordBotLog.txt", "a")
    f.write(f'{datetime.datetime.now()}: {msg}\n')
    f.close()