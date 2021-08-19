import os
import discord
from discord.ext import commands
from discord.ext import tasks
from dotenv import load_dotenv
from commands.GetPlayerCount import GetPlayerCount
from utility import Log
from commands.Alerts import Alerts

load_dotenv('test.env')
TOKEN = os.getenv('DISCORD_TOKEN_TEST')

guild_id = os.getenv('DISCORD_GUILD')
channel_id = os.getenv('DISCORD_TRIBE_MSG_CHANNEL_ID')

bot = commands.Bot(command_prefix='!')

@bot.command(name='playercount', help = '''gets the current players on a server according to battle metrics\n' \
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

@tasks.loop(minutes=10)
async def raid_alert():
    await bot.wait_until_ready()  # Make sure your guild cache is ready so the channel can be found via get_channel
    #gets the variables required
    load_dotenv('test.env')
    channel_id = os.getenv('DISCORD_TRIBE_MSG_CHANNEL_ID')
    channel = bot.get_channel(int(channel_id))
    server_id = os.getenv('SERVER_ALERT')
    alerts = Alerts()
    pc = GetPlayerCount()
    online_players = pc.get_player_count(server_id)
    # gets the players that we don't need to track:
    url = os.getenv('ALLY_MEMBERS_API')
    ally_count = len(alerts.get_online_info(url))
    #gets the total online players
    potential_raid = alerts.bool_potential_raid(online_players, ally_count)
    #sends a message if more than x people are online
    if potential_raid:
        await channel.send(f"Looks like there might be {potential_raid} non-allies currently online in Valguero")
    enemies_online = alerts.get_alert_enemy_on()
    leng = len(enemies_online)
    print(f'{enemies_online} length {leng}')
    if len(enemies_online) > 4:
        await channel.send(f"{enemies_online}")

raid_alert.start()
bot.run(TOKEN)
