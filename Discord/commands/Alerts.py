import os
import discord
from dotenv import load_dotenv
import requests
import datetime
import json
from Log import discord_log
from commands.GetPlayerCount import GetPlayerCount

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

    def get_online_info(self, url, server_name, server_id):
        msgs = self.get_online_count(url, server_name, server_id)
        return self.single_msg(msgs)

    def get_online_count(self, url, server_name, server_id):
        # gets the players to track:
        r = requests.get(url)

        jsonObject = r.json()
        msgs = []
        # gets the url to query the API
        bm_api = os.getenv('BATTLEMETRICS_API_URL')
        player = os.getenv('PLAYERS_ENDPOINT')
        server_endpoint = os.getenv('SERVER_ENDPOINT')

        for x in jsonObject:
            battlemetrics_id = x['battlemetrics_id']
            ign = x['ign']
            notes = x['notes']
            steam_name = x['steam_name']
            # builds the URL
            url = f'{bm_api}{player}{battlemetrics_id}{server_endpoint}{server_id}'
            r = requests.get(url)
            #for player that has not played on the server
            if r.status_code == 200:
                jsonObject = r.json()
                # battle metrics to see if they're online or not
                online = jsonObject['data']['attributes']['online']
                if online:
                    msg = f'{ign} is currently online at {server_name} --- Notes: {notes}\n'
                    msgs.append(msg)
            elif r.status_code == 429:
                msg = f'Limit exceeded. Please try again in 2 minutes'
                msgs.append(msg)
            else:
                discord_log(f'{steam_name} | api {url} gave the response {r}\n {r.json()}')
        return msgs

    #gets the count of total non-allies or 123 players in the server
    def non_allies_online_count(self, url_allies, server_name, server_id, online_players):
        ally_count = len(self.get_online_count(url_allies, server_name, server_id))

        discord_log(f'There are {online_players-ally_count} non-allies or "123" online at {server_name}')
        return online_players-ally_count

    #creates a string so discord sends one message instead of many
    def single_msg(self, msgs):
    # # formatting for discord - sends an empty line
        msg = '_ _\n'
        for x in msgs:
            msg = f'{msg} {x}'
        return msg