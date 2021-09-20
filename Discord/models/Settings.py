import requests
import os
from dotenv import load_dotenv
from helpers.Logging import Logging


class Settings():
    logging = Logging()

    def __init__(self):
        # initialize the values
        load_dotenv()
        self.config = {}

        self.config = {"DISCORD_TOKEN": os.getenv('DISCORD_TOKEN'),
                       "DISCORD_TRIBE_MSG_CHANNEL_ID": os.getenv('DISCORD_TRIBE_MSG_CHANNEL_ID'),
                       "API_AUTH_TOKEN": os.getenv('API_AUTH_TOKEN'),
                       "API_BATTLEMETRICS_BASEURL": os.getenv('API_BATTLEMETRICS_BASEURL'),
                       "API_BATTLEMETRICS_PLAYERDETAILS": os.getenv('API_BATTLEMETRICS_PLAYERDETAILS'),
                       "API_BATTLEMETRICS_SERVERDETAILS": os.getenv('API_BATTLEMETRICS_SERVERDETAILS'),
                       "API_ARKDATA_BASEURL": os.getenv('API_ARKDATA_BASEURL'),
                       "API_ARKDATA_PLAYERS": os.getenv('API_ARKDATA_PLAYERS'),
                       "API_ARKDATA_ALLIES": os.getenv('API_ARKDATA_ALLIES'),
                       "API_ARKDATA_ENEMIES": os.getenv('API_ARKDATA_ENEMIES'),
                       "API_ARKDATA_SERVERS": os.getenv('API_ARKDATA_SERVERS'),
                       "ALERT_THRESHOLD_ONLINE_TIMER": os.getenv('ALERT_THRESHOLD_ONLINE_TIMER'),
                       "ALERT_THRESHOLD_OFFLINE_TIMER": os.getenv('ALERT_THRESHOLD_OFFLINE_TIMER'),
                       "OFFLINE_TIME_START": os.getenv('OFFLINE_TIME_START'),
                       "OFFLINE_TIME_END": os.getenv('OFFLINE_TIME_END')}
