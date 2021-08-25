import os
import discord
from discord.ext import commands
from discord.ext import tasks
from dotenv import load_dotenv
from commands.GetPlayerCount import GetPlayerCount
from commands.Alerts import Alerts
import requests
import time

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

guild_id = os.getenv('DISCORD_GUILD')
channel_id = os.getenv('DISCORD_TRIBE_MSG_CHANNEL_ID')

bot = commands.Bot(command_prefix='!')
@bot.command(name='playercount', help = '''sends a message about the total players in a server\n' \
[filter] can be a specific server(s) or it can can have the flag [all] to get all the people for all servers.\n'\
The current servers are [Valguero, TheCenter, ScorchedEarth, CrystalIsles, Aberration, Extinction, Ragnarok, Genone, TheIsland, GenTwo]''')
async def player_count(ctx, value):
    player_count = GetPlayerCount()
    msg = player_count.parse_message(value)
    await ctx.send(msg)

@bot.command(name='allies', help = '''The list of the current allies that's not named '123' that we don't need to track''')
async def player_count(ctx):
    alerts = Alerts()
    await ctx.send(alerts.get_allies())

@bot.command(name='enemies', help = '''The list of the current enemies that's not named '123' that we need to track''')
async def player_count(ctx):
    alerts = Alerts()
    await ctx.send(alerts.get_enemies())

@bot.command(name='cloudnudes', help = '''special request from crew''')
async def player_count(ctx):
    await ctx.send('<https://www.youtube.com/watch?v=dQw4w9WgXcQ>')

@bot.command(name='alert', help = '''gives a message about how many non-friendly members or "123" are on a given server \n' \
[filter] has to be a specific server\n'\
The current servers are [Valguero, TheCenter, ScorchedEarth, CrystalIsles, Aberration, Extinction, Ragnarok, Genone, TheIsland, GenTwo]''')
async def alert_discord(ctx, val):
    # servers to track
    load_dotenv()
    server_url = os.getenv('SERVERS_API')
    url_allies = os.getenv('ALLY_MEMBERS_API')
    url_enemies = os.getenv('ENEMY_MEMBERS_API')

    alerts = Alerts()

    r = requests.get(server_url)
    servers = r.json()
    val_found = False



    #finds the server to query
    for x in servers:
        server_name = x['server_name']
        server_id = x['server_id']
        if server_name == val:
            # gets the total players
            pc = GetPlayerCount()
            online_players = pc.get_player_count(server_id)

            #sends the non-friendlys count msg
            non_allies = alerts.non_allies_online_count(url_allies, server_name, server_id, online_players)
            msg = f"{server_name} | {online_players} total online players. {non_allies} of them are either non-allies or '123'"

            # see if enemy is only at a specific server
            enemies_online = alerts.get_online_info(url_enemies, server_name, server_id)
            if len(enemies_online) > 4:
                msg = f'{msg}\n{enemies_online}'
            val_found = True
            await ctx.send(f"{msg}")
            break
    if not val_found:
        ctx.send(f'Your input [{val}] was invalid for !alert. Please try again or get help with !help')

@tasks.loop(minutes=45)
async def raid_alert_valg(server_name, server_id, alert_threshold):
    await bot.wait_until_ready()
    load_dotenv()
    channel_id = os.getenv('DISCORD_TRIBE_MSG_CHANNEL_ID')
    channel = bot.get_channel(int(channel_id))
    # gets the players that we don't need to track:
    url_allies = os.getenv('ALLY_MEMBERS_API')
    url_enemies = os.getenv('ENEMY_MEMBERS_API')

    #gets the total players
    pc = GetPlayerCount()
    online_players = pc.get_player_count(server_id)

    #gets the total non friendly players
    alerts = Alerts()
    non_allies = alerts.non_allies_online_count(url_allies, server_name, server_id, online_players)
    msg = ""
    if non_allies > alert_threshold:
        online_msg = f"{server_name} | {online_players} total online players. {non_allies} of them are either non-allies or '123'"
        msg = f'{msg}{online_msg}\n'
    #see if enemy is only at a specific server
    enemies_online = alerts.get_online_info(url_enemies, server_name, server_id)
    if len(enemies_online) > 4:
        msg = f'{msg} {online_msg}\n'
    if len(msg) >0:
        await channel.send(msg)

# sends an auto message if more than x people are online based on thresold
alert_threshold = int(os.getenv('DISCORD_ALERT_THRESHOLD'))

raid_alert_valg.start('Valguero', 7256984, alert_threshold)
bot.run(TOKEN)
