import requests

class Server:
    def __init__(self, settings):
        self.servers = {}
        # gets the latest servers to track
        url = f'{settings.config["api_arkdata_baseurl"]}{settings.config["api_arkdata_servers"]}'
        r = requests.get(url)
        for x in r.json():
            server_name = x["server_name"]
            server_id = x["server_id"]
            self.servers.update({server_name: server_id})

