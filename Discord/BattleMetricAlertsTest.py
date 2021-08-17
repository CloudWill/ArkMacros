import os
import discord
from dotenv import load_dotenv
import requests
import datetime

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

#gets the player count for a server
async def get_player_count(serverid):
    debug_log(f'get_player_count {serverid}'
    )
    url = f'https://api.battlemetrics.com/servers/{serverid}'
    r = requests.get(url)
    #gets result code
    debug_log(r)
    jsonObject = r.json()

    data = jsonObject["data"]
    playerCount = data['attributes']['players']
    server = data['attributes']['details']['map']
    returReq = f'There are {playerCount} people online in {server} \n'
    debug_log(f'{returReq}')
    return returReq

def get_help(serverFilters):
    debug_log(f'get_help')
    response = '\n\n ~ ~ ~ ~ ~ ~ ~ ~ ~ \n\ncurrent commands are prefaced with \'!\'\n' \
               '!help - gives the available commands\n' \
               '!playercount [filter] - gets the current players according to battle metrics\n' \
               '[filter] can be a specific server(s) seperated by space or can have the flag [all] to get all the people for all servers.\n' \
               f'The current filters are [{serverFilters}] \n' \
                'ie [!playercount valguero] will print the player count on valguero\n' \
               'ie [!playercount thecenter ragnarok] will print the player count on thecenter and ragnarok\n' \
               'ie [!playercount all] will print the player count on all servers on crossark 14.\n' \
               '\n\n ~ ~ ~ ~ ~ ~ ~ ~ ~ \n\n'

    return(response);

@client.event
async def on_message(message):
    #does not respond to own message
    if message.author == client.user:
        return

    servers = {
        "valguero" : "7256984",
        "thecenter" : "7256988",
        "scorchedearth": "7259890",
        "crystalisles" : "7256991",
        "aberration" : "7263880",
        "extinction": "7261156",
        "ragnarok": "7256162",
        "genone" : "7992158",
        "theisland" : "7256172",
        "gentwo": "12050793"
    }

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
            #if multiple
            arguments = msg.split()
            debug_log(arguments)

            if len(arguments) > 1:
                #skips the first argument because it's the trigger word
                for x in arguments[1:]:
                    #ignores extra spaces
                    if ' ' not in x:
                        #see if key exists
                        if x in servers:
                            debug_log(x)
                            resp = await get_player_count(servers[x])
                            total_player_count.append(resp)
                        else:
                            resp = f'Your input of {x} was invalid for !playercount. Please try again or get help with !help'
                            total_player_count.append(resp)
            else:
                resp =f'Your input of {msg} was invalid for !playercount. Please try again or get help with !help'
                total_player_count.append(resp)
        # sends one message compared to all of them
        msg = ""
        for x in total_player_count:
            msg = msg + x
        debug_log(msg)

    #help
    if msg.startswith('!help'):
        debug_log(f'{message.author} requested')
        serverFilters = ""
        count = 0
        for x in servers:
            if count ==0:
                serverFilters = x
            else:
                serverFilters = f'{serverFilters}, {serverFilters}'
            count+1
        await message.channel.send(get_help(serverFilters))

    if msg.startswith('!cloudnudes'):
        await message.channel.send('<https://www.youtube.com/watch?v=dQw4w9WgXcQ>')

client.run(TOKEN)
