import os
import discord
from dotenv import load_dotenv
import requests
import datetime
import json

class Alerts():
    def __init__(self):
        load_dotenv('test.env')

    def get_info(self, url):
        r = requests.get(url)
        jsonObject = r.json()
        msgs = []
        msg = f'formatting is:\n [ign] --- [notes]\n'
        msgs.append(msg)
        for x in jsonObject:
            ign = x['ign']
            notes = x['notes']
            msg = f'{ign} --- {notes}\n'
            msgs.append(msg)
        return self.single_msg(msgs)

    def get_allies(self):
        url = os.getenv('ALLY_MEMBERS_API')
        return self.get_info(url)

    def get_enemies(self):
        url = os.getenv('ENEMY_MEMBERS_API')
        return self.get_info(url)

    def get_online_info(self, url):
        # gets the players to track:
        r = requests.get(url)
        jsonObject = r.json()
        msgs = []
        # gets the url to query the API
        bm_api = os.getenv('BATTLEMETRICS_API_URL')
        player = os.getenv('PLAYERS_ENDPOINT')
        server = os.getenv('SERVER_ENDPOINT')
        server_alert = os.getenv('SERVER_ALERT')

        for x in jsonObject:
            battlemetrics_id = x['battlemetrics_id']
            ign = x['ign']
            notes = x['notes']
            # builds the URL
            url = f'{bm_api}{player}{battlemetrics_id}{server}{server_alert}'
            r = requests.get(url)
            jsonObject = r.json()
            # battle metrics to see if they're online or not
            online = jsonObject['data']['attributes']['online']
            if online:
                msg = f'{ign} is currently online --- Notes: {notes}'
                msgs.append(msg)
        return msgs

    def get_alert_enemy_on(self):
        #gets the players that we need to track:
        url = os.getenv('ENEMY_MEMBERS_API')
        #gets all the online members
        msgs = self.get_online_info(url)
        return self.single_msg(msgs)

    def bool_potential_raid(self, online_count, ally_count):
        alert_threshold = int(os.getenv('DISCORD_ALERT_THRESHOLD'))
        #gets the count of total players in the server:
        if (online_count-ally_count) > alert_threshold:
            return online_count-ally_count
        return 0

    def single_msg(self, msgs):
    # # formatting for discord - sends an empty line
        msg = '_ _\n'
        for x in msgs:
            msg = f'{msg} {x}'
        return msg