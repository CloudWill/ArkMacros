import asyncio
import os
import traceback
from datetime import datetime
from helpers.Logging import Logging
from models.Settings import Settings
from discord.ext import commands
from discord.ext import tasks
from Battlemetrics.PlayerCount import PlayerCount
from Battlemetrics.OnlinePlayers import OnlinePlayers
from helpers.Helpers import Helpers
from models.Servers import Servers
from models.Players import Players
from ArkData.PlayersController import PlayerController


async def get_alert(val, auto):
    val = val.lower()

    msgs = []

    online_allies = online_players.get_online_allies(val)
    online_enemies = online_players.get_online_enemies(val)

    server = helpers.get_server(val)
    total_player_count = player_count.get_player_count(server.server_id)
    non_allies_count = total_player_count - len(online_allies)

    msg = f"{server.server_name} | {total_player_count} total online players. {non_allies_count} of them are either non-allies or '123'"
    msgs.append(msg)

    msg = 'ALLIES'
    msgs.append(msg)

    for msg in online_allies:
        msgs.append(msg)

    msg = 'ENEMIES'
    msgs.append(msg)
    for msg in online_enemies:
        msgs.append(msg)

    # only send a message in the auto alerts if a threshold is met
    if auto:
        offline_time_start = int(settings.config['OFFLINE_TIME_START'])
        offline_time_end = int(settings.config['OFFLINE_TIME_END'])
        # sends an auto message if more than x people are online based on thresold
        alert_threshold = int(settings.config['ALERT_THRESHOLD_ONLINE_TIMER'])

        now = datetime.now()
        current_hour = int(now.strftime("%H"))

        between = offline_time_start <= current_hour <= offline_time_end
        # offline timer, less people on to notify
        if between:
            alert_threshold = int(os.getenv('ALERT_THRESHOLD_OFFLINE_TIMER'))
        logging.log_info(f'Current threshold is: {alert_threshold}')
        if non_allies_count >= alert_threshold:
            msgs.insert(0, 'AUTO MESSAGE')
            return msgs
        else:
            return []
    return msgs


bot = commands.Bot(command_prefix='!')

@bot.command(name='playercount', help='''Responds with the total players in a server\n' \
[filter] can be a specific server(s) or it can can have the flag [all] to get all the people for all servers.\n'\
The current servers are [Valguero, TheCenter, ScorchedEarth, CrystalIsles, Aberration, Extinction, Ragnarok, Genone, TheIsland, GenTwo]''')
async def player_count(ctx, val):
    val = val.lower()
    msgs = helpers.discord_msg(player_count.filter_server(val))
    for msg in msgs:
        await ctx.send(msg)


@bot.command(name='allies', help=''' Responds with the list of allies not named '123' ''')
async def player_count(ctx):
    msgs = helpers.discord_msg(player_controller.get_allies_info())
    for msg in msgs:
        await ctx.send(msg)


@bot.command(name='enemies', help=''' Responds with the list of enemies not named '123' ''')
async def player_count(ctx):
    msgs = helpers.discord_msg(player_controller.get_enemies_info())
    for msg in msgs:
        await ctx.send(msg)


@bot.command(name='alert', help='''Responds with how many non-ally or "123" are on a given server \n' \
[filter] has to be a specific server\n'\
The current servers are [Valguero, TheCenter, ScorchedEarth, CrystalIsles, Aberration, Extinction, Ragnarok, Genone, TheIsland, GenTwo]''')
async def alert_discord(ctx, val):
    msgs = await get_alert(val, False)
    filtered_msgs = helpers.discord_msg(msgs)
    for msg in filtered_msgs:
        await ctx.send(msg)


@tasks.loop(minutes=60)
async def raid_alert_valg(val):
    await bot.wait_until_ready()
    channel_id = settings.config["DISCORD_TRIBE_MSG_CHANNEL_ID"]
    channel = bot.get_channel(int(channel_id))

    msgs = await get_alert(val, True)
    # only send messages if the threshold is met
    print(len(msgs))
    if len(msgs) != 0:
        filtered_msgs = helpers.discord_msg(msgs)
        for msg in filtered_msgs:
            await channel.send(msg)


# initialize logging
data = {}
logging = Logging()
data.update({'logging': logging})

settings = Settings()

data.update({'settings': settings})
sleep_time = 10

while True:

    try:
        # starting time for script
        current_time = datetime.now()

        # gets the latest data
        servers = Servers(settings)
        data.update({'servers': servers})

        helpers = Helpers(data)
        data.update({"helpers": helpers})

        players = Players(data)
        data.update({'players': players})


        online_players = OnlinePlayers(data)
        player_count = PlayerCount(data)

        player_controller = PlayerController(data)

        raid_alert_valg.start('Valguero')
        bot.run(settings.config["DISCORD_TOKEN"])

    except Exception:
        logging.log_info(f'ERROR: {traceback.print_exc}')
        asyncio.create_task(bot.close())
