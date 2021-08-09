import os
import discord
from dotenv import load_dotenv
import random
from discord.ext import tasks, commands
import pyodbc

@tasks.loop(seconds = 60) # repeat after every 10 seconds
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
            channel = client.get_channel(int(874233041529241631))
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


myLoop.start()


client.run(TOKEN)
