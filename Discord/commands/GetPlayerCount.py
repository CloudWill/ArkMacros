from utility.Log import discord_log
import requests
import os
from dotenv import load_dotenv
import json

class GetPlayerCount():
    def __init__(self):
        load_dotenv('test.env')

    # gets the player count for a server
    def get_player_count(self, serverid):
        # gets the url to query the API
        bm_api = os.getenv('BATTLEMETRICS_API_URL')
        player = os.getenv('PLAYERS_ENDPOINT')
        server = os.getenv('SERVER_ENDPOINT')
        url = f'{bm_api}{server}{serverid}'
        r = requests.get(url)
        # gets result code
        discord_log(f'get_player_count server {serverid} result code {r}')
        jsonObject = r.json()

        data = jsonObject["data"]
        playerCount = data['attributes']['players']
        server = data['attributes']['details']['map']
        return playerCount

    def parse_message(self, val):
        #gets the servers to check playercount
        url = os.getenv('SERVERS_API')
        r = requests.get(url)
        servers = r.json()
        total_player_count = []
        #gets all the server player count
        if 'all' in val:
            for x in servers:
                count = self.get_player_count(x['server_id'])
                server = x['server_name']
                resp = f'\nThere are {count} people online in {server}'
                total_player_count.append(resp)
        #gets a specific server player count
        else:
            for x in servers:
                server = x['server_name']
                server_id = x['server_id']
                if server == val:
                    count = self.get_player_count(server_id)
                    resp = f'\nThere are {count} people online in {val}'
                    total_player_count.append(resp)
                    break
            else:
                resp = f'Your input [{val}] was invalid for !playercount. Please try again or get help with !help'
                total_player_count.append(resp)

        #formatting for discord - sends an empty line
        msg = "_ _"
        for x in total_player_count:
            msg = f'{msg} {x}'
        return msg