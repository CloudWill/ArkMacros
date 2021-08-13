import datetime
import os
import discord
from dotenv import load_dotenv
from discord.ext import tasks, commands
import json
import requests
import time
def Logging(msg):
    print(f'{datetime.datetime.now()} : {msg}')

@tasks.loop(seconds = 90) # repeat after every x seconds
async def RunTribeLogAlert():
    Logging('RunTribeLogAlert')
    await client.wait_until_ready()

    load_dotenv()

    channelId = os.getenv('DISCORD_TRIBE_MSG_CHANNEL_ID')
    channel = client.get_channel(int(channelId))

    url = os.getenv('URL_TRIBE_MSG_LOG')
    parameters = {
        'killed', 'destroyed'}
    jsonArray = []
    for x in parameters:
        jsonString = {}
        jsonString["MsgCategory"] = x
        jsonArray.append(jsonString)

    data_json = json.dumps(jsonArray)

    payload = {'MsgCategories': data_json}

    # see if it is successful before changing values
    r = requests.get(url, data=payload)
    print(r)


    jsonObject = r.json()
    print(f'\n\n\njson {len(jsonObject)}\n\n\n')
    # sends the keys and values
    count = 0
    while count < len(jsonObject):
        item = jsonObject[count]
        cat = item["Category"]
        date = item["InGameDate"]
        msg = item["Msg"]
        await channel.send(f'{cat} ||| {date}:{msg}')
        count+=1
    url = os.getenv('URL_UPDATE_MSG_DISCORD_READ')
    r = requests.put(url, data=payload)


load_dotenv()

TOKEN = os.getenv('DISCORD_TOKEN')
client = discord.Client()

RunTribeLogAlert.start()

client.run(TOKEN)


