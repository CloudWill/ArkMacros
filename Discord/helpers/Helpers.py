from urllib.parse import urljoin
from functools import reduce
import requests
from urllib.parse import urljoin


class Helpers:
    def __init__(self, data):
        # initialize the values
        self.settings = data["settings"]
        self.servers = data["servers"]

    # creates a string(s) so discord sends a message with the limit of 2000 instead of many
    def discord_msg(self, msgs):
        # formatting for discord - sends an empty line
        msg = '_ _'
        discord_msg = []
        print(msgs)
        for x in msgs:
            #discord limit

            if len(msg) + len(x) > 2000:
                discord_msg.append(msg)
                msg = '_ _\n'
            msg = f'{msg} \n {x}'
        #adds the remaining message to the array
        if len(msg) != 4:
            discord_msg.append(msg)
        return discord_msg

    def battlemetrics_url_builder(self, url_parts):
        bm_api = self.settings.config['API_BATTLEMETRICS_BASEURL']

        # adds the base to the beginning
        url_parts.insert(0, bm_api)
        url = reduce(urljoin, url_parts)
        response = requests.get(url, headers={'Authorization': self.settings.config['API_AUTH_TOKEN']})

        return response

    def arkdata_url_builder(self, url_parts):
        ad_api = self.settings.config['API_ARKDATA_BASEURL']
        url_parts.insert(0, ad_api)
        url = reduce(urljoin, url_parts)
        response = requests.get(url)

        return response


    # finds a specific server based on value
    def get_server(self, val):
        for x in self.servers.servers:
            server = x.server_name
            if server == val:
                return x
                break
        return None