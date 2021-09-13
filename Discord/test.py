import os
import traceback

import discord
from dotenv import load_dotenv
from datetime import datetime
from utilities.Logging import Logging
from models.Settings import Settings
from pprint import pprint

#initilize logging
logging = Logging()

try:
    logging.log_info('Starting the bot')

    # initialize the values
    load_dotenv()
    set_settings = {"discord_token": os.getenv('DISCORD_TOKEN'),
                    "discord_msg_channel_id": os.getenv('DISCORD_TRIBE_MSG_CHANNEL_ID'),
                    "api_battlemetrics_baseurl": os.getenv('API_BATTLEMETRICS_PLAYERDETAILS'),
                    "api_battlemetrics_playerdetails": os.getenv('API_BATTLEMETRICS_PLAYERDETAILS'),
                    "api_battlemetrics_serverdetails": os.getenv('API_BATTLEMETRICS_SERVERDETAILS'),
                    "api_arkdata_baseurl": os.getenv('API_ARKDATA_BASEURL'),
                    "api_arkdata_allies": os.getenv('API_ARKDATA_ALLIES'),
                    "api_arkdata_enemies": os.getenv('API_ARKDATA_ENEMIES'),
                    "api_arkdata_servers": os.getenv('API_ARKDATA_SERVERS'),
                    "alert_threshold_online_timer": os.getenv('ALERT_THRESHOLD_ONLINE_TIMER'),
                    "alert_threshold_offline_timer": os.getenv('ALERT_THRESHOLD_OFFLINE_TIMER'),
                    "offline_time_start": os.getenv('OFFLINE_TIME_START'),
                    "offline_time_end": os.getenv('OFFLINE_TIME_END')}

    settings = Settings(set_settings)
    # pprint(vars(settings))
    #
    # for x in settings.config:
    #     print(f'key {x} val {settings.config[x]}')



except Exception:
    logging.log_info(f'ERROR: {traceback.print_exc}')





