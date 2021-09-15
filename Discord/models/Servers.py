import requests


class Server:
    def __init__(self, server_id, server_name):
        self.server_name = server_name
        self.server_id = server_id


class Servers:
    def __init__(self, settings):
        self.servers = []
        # gets the latest servers to track
        url = f'{settings.config["API_ARKDATA_BASEURL"]}{settings.config["API_ARKDATA_SERVERS"]}'
        r = requests.get(url)
        print(r)
        for x in r.json():
            server_name = x["server_name"]
            server_id = x["server_id"]
            server = Server(server_id, server_name)
            self.servers.append(server)

