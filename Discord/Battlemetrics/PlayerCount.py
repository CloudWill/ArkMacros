import time


class PlayerCount:
    def __init__(self, data):
        self.logging = data["logging"]
        self.settings = data["settings"]
        self.servers = data["servers"]
        self.helpers = data["helpers"]

    # gets the player count for a server
    def get_player_count(self, server_id):
        # gets the url to query the API
        server = self.settings.config['API_BATTLEMETRICS_SERVERDETAILS']
        url_parts = [server, server_id]

        #try x times in case of error
        count = 0
        while count < 2:

            r = self.helpers.battlemetrics_url_builder(url_parts)
            # gets result code
            self.logging.log_info(f'get_player_count server {server_id} result code {r}')
            if r.status_code == 200:
                jsonObject = r.json()
                data = jsonObject["data"]
                playerCount = data['attributes']['players']
                return playerCount
            count += 1
            time.sleep(3)
        self.logging.log_info(f'Error in get_player_count')
        return -1

    def filter_server(self, val):
        total_player_count = []
        #gets all the server player count
        if 'all' in val:
            for x in self.servers.servers:
                server = x.server_name
                server_id = x.server_id
                count = self.get_player_count(server_id)
                resp = f'\nThere are {count} people online in {server}'
                total_player_count.append(resp)
        #gets a specific server player count
        else:
            for x in self.servers.servers:
                server = x.server_name
                server_id = x.server_id
                if server == val:
                    count = self.get_player_count(server_id)
                    resp = f'\nThere are {count} people online in {val}'
                    total_player_count.append(resp)
                    break
            else:
                resp = f'!playercount {val} was invalid. Please try again or get help with !help'
                total_player_count.append(resp)
        return total_player_count