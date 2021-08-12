import os
import discord
from dotenv import load_dotenv
import random
from discord.ext import tasks, commands
import pyodbc
import json
import urllib.request
import requests

def response(url):
    with urllib.request.urlopen(url) as response:
        return response.read()

@tasks.loop(seconds = 90) # repeat after every x seconds
async def dataTest():
    await client.wait_until_ready()
    channel = client.get_channel(int(874106526023970839))
    #API for discord bot
    url = "http://localhost:8000/users"
    parameters = {
        'cat:': '\'killed\', \'destroyed\''}
    r = requests.post(url, params=parameters)
    jsonObject = r.json()
    # print the keys and values
    for x in jsonObject:
        print(f'Day {x["InGameDay"]} : {x["Msg"]}')
        #await channel.send(f'{x}')



@tasks.loop(seconds = 90) # repeat after every x seconds
async def myLoop():
    # ODB settings
    #print("connecting to DB")
    driver = "SQL Server"
    server = "DESKTOP-HESFTCJ"
    db = "ArkData"
    user = "local123"
    password = "local123"

    # creating connection Object which will contain SQL Server Connection
    sql_conn = pyodbc.connect('driver={%s};server=%s;database=%s;trusted_connection=yes' % (driver, server, db))
    cursor = sql_conn.cursor()

    # Searches to see if there are any msgs to send
    categories = ['killed', 'destroyed']

    for cat in categories:
        cursor.execute("select CategoryId from Category where CategoryName = (?)", cat)
        exists = cursor.fetchone()
        categId = exists[0]
        #checks to see if the entry has already been added or not
        cursor.execute("select * from TribeLogsVal where DiscordBot = (?) AND CategoryId = (?)",
                       0, categId)  # check to see if record exists
        exists = cursor.fetchall()
        for x in exists:
            await client.wait_until_ready()
            channel = client.get_channel(int(874106526023970839))
            await channel.send(f'{cat} ||| Day {x[1]} - {x[2]}')
            #updates to read
            cursor.execute('''
                UPDATE TribeLogsVal
                SET
                    DiscordBot = 1
                WHERE
                    InGameDay = (?)
                    AND
                    Msg = (?)
                    AND
                    CategoryId = (?)
            ''', x[1], x[2], categId)

    sql_conn.commit()
    sql_conn.close()




load_dotenv()

#https://realpython.com/how-to-make-a-discord-bot-python/
TOKEN = os.getenv('DISCORD_TOKEN')
client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user.name} has connected to Discord!')


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    brooklyn_99_quotes = [
        'I\'m the human form of the 💯 emoji.',
        'Bingpot!',
        (
            'Cool. Cool cool cool cool cool cool cool, '
            'no doubt no doubt no doubt no doubt.'
        ),
    ]

    if message.content == '99!':
        response = random.choice(brooklyn_99_quotes)
        await message.channel.send(response)


#dataTest.start()

url = "http://localhost:8002/test"
parameters = {
    'cat:': 'froze'}
r = requests.get(url, params=parameters)
jsonObject = r.json()
# print the keys and values
print(jsonObject)
# for x in jsonObject:
#     print(x)





# client.run(TOKEN)
