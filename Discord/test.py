import asyncio
import os
import traceback
from commands.Alerts import Alerts
import discord
from datetime import datetime
from utilities.Logging import Logging
from models.Settings import Settings
import time
from discord.ext import commands
from discord.ext import tasks
from controllers.Battlemetrics import GetPlayerCount
import requests
from models.Server import Server

# initialize logging
logging = Logging()
logging.log_info('Starting the bot')
settings = Settings()
sleep_time = 10

count =1
while count <2:
    count += 1
    try:
        # starting time for script
        current_time = datetime.now()


        #bot.run(settings.config['discord_token'])
        bot = commands.Bot(command_prefix='!')

        #gets the latest data
        servers = Server(settings)

        for x in servers.servers:
            print(f'x is {x} and val are {servers.servers[x]}')

        # servers = r.json()
        # total_player_count = []
        # # gets all the server player count
        # if 'all' in val:
        #     for x in servers:
        #         count = self.get_player_count(x['server_id'])
        #         server = x['server_name']
        #         resp = f'\nThere are {count} people online in {server}'
        #         total_player_count.append(resp)
        # # gets a specific server player count
        # else:
        #     for x in servers:
        #         server = x['server_name']
        #         server_id = x['server_id']
        #         if server == val:
        #             count = self.get_player_count(server_id)
        #             resp = f'\nThere are {count} people online in {val}'
        #             total_player_count.append(resp)
        #             break
        #     else:
        #         resp = f'Your input [{val}] was invalid for !playercount. Please try again or get help with !help'
        #         total_player_count.append(resp)
        #

    except Exception:
        logging.log_info(f'ERROR: {traceback.print_exc}')
        asyncio.create_task(bot.close())

    # returns a timedelta object
    running_time = datetime.now() - current_time
    # Total difference in minutes
    minutes = running_time.total_seconds() / 60
    # if running time has been longer than 3 hours, it's a random error that needs addressing but the bot can restart
    # with 0 delay
    sleep_time = sleep_time * 2
    minutes = running_time.seconds / 60
    if minutes > 60 * 3:
        sleep_time = 0

    # sleep x seconds to run the bot again
    #time.sleep(sleep_time)



@bot.command(name='playercount', help = '''Responds with the total players in a server(s) \n' \
[filter] can be a specific server or it can can have the flag [all] to get all the people for all servers.\n'\
The current servers are [Valguero, TheCenter, ScorchedEarth, CrystalIsles, Aberration, Extinction, Ragnarok, Genone, TheIsland, GenTwo]''')
async def player_count(ctx, val):
    val = val.lower()
    player_count = GetPlayerCount()
    msg = player_count.parse_message(val)
    await ctx.send(msg)

