from utilities.Logging import Logging
import requests
import os

class GetPlayerCount():
    def __init__(self, settings):
        self.settings = settings
        self.logging = Logging()

    # gets the player count for a server
    def get_player_count(self, serverid):
        # gets the url to query the API
        bm_api = self.setting('api_battlemetrics_baseurl')
        server = self.setting('api_battlemetrics_serverdetails')
        url = f'{bm_api}{server}{serverid}'
        #queries the url
        r = requests.get(url)
        # gets result code
        self.logging.log_info(f'get_player_count server {serverid} result code {r}')
        if r.status_code == 200:
            jsonObject = r.json()

            data = jsonObject["data"]
            playerCount = data['attributes']['players']
            server = data['attributes']['details']['map']
            return playerCount
        self.logging.log_info(f'returning -1')
        return -1

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