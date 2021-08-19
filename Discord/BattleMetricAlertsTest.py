import os
import discord
from dotenv import load_dotenv
import requests
import datetime
import json

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN_TEST')

client = discord.Client()
channelId = os.getenv('DISCORD_TRIBE_MSG_CHANNEL_ID_TEST')
channel = client.get_channel(int(channelId))

def debug_log(msg):
    print(f'{datetime.datetime.now()}: {msg}')

@client.event
async def on_ready():
    debug_log(f'{client.user.name} has connected to Discord!')

# gets the player count for a server
async def get_player_count(serverid):
    debug_log(f'get_player_count {serverid}'
              )
    url = f'https://api.battlemetrics.com/servers/{serverid}'
    r = requests.get(url)
    # gets result code
    debug_log(r)
    jsonObject = r.json()

    data = jsonObject["data"]
    playerCount = data['attributes']['players']
    server = data['attributes']['details']['map']
    returReq = f'\nThere are {playerCount} people online in {server}'
    debug_log(f'{returReq}')
    return playerCount


def get_help(serverFilters):
    debug_log(f'get_help')
    response = os.getenv('DISCORD_BOT_HELP')
    return (response);

@client.event
async def on_message(message):
    # does not respond to own message
    if message.author == client.user:
        return
    #gets the JSON object from the env and then converts the ' to ". (') is proper .env fromatting and (") is proper json formatting
    servers = json.loads(os.getenv('DISCORD_BOT_SERVERS').replace("'", "\""))
    msg = message.content
    msg = msg.lower()

    if msg.startswith('!playercount'):
        debug_log(f'{message.author} requested')
        total_player_count = []
        if 'all' in msg:
            for x in servers:
                resp = await get_player_count(servers[x])
                total_player_count.append(resp)
        else:
            # if multiple
            arguments = msg.split()
            debug_log(arguments)

            if len(arguments) > 1:
                # skips the first argument because it's the trigger word
                for x in arguments[1:]:
                    # ignores extra spaces
                    if ' ' not in x:
                        # see if key exists
                        if x in servers:
                            debug_log(x)
                            count = await get_player_count(servers[x])
                            f'\nThere are {count} people online in {x}'
                            total_player_count.append(resp)
                        else:
                            resp = f'Your input of {x} was invalid for !playercount. Please try again or get help with !help'
                            total_player_count.append(resp)
            else:
                resp = f'Your input of {msg} was invalid for !playercount. Please try again or get help with !help'
                total_player_count.append(resp)
        # sends one message compared to all of them
        #formatting for discord - sends an empty line
        msg = "_ _"
        for x in total_player_count:
            msg = msg + x
        await message.channel.send(msg)

    # help
    if msg.startswith('!help'):
        debug_log(f'{message.author} requested')
        serverFilters = ""
        count = 0
        for x in servers:
            if count == 0:
                serverFilters = x
            else:
                serverFilters = f'{serverFilters}, {serverFilters}'
            count + 1
        await message.channel.send(get_help(serverFilters))

    if msg.startswith('!cloudnudes'):
        await message.channel.send('<https://www.youtube.com/watch?v=dQw4w9WgXcQ>')

client.run(TOKEN)
