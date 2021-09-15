import datetime

class Logging:
    def __init__(self):
        self.log_info(f'Starting Application')

    def log_info(self, msg):
        print(f'{datetime.datetime.now()}: {msg}')
        # f = open("log_info.txt", "a")
        # f.write(f'{datetime.datetime.now()}: {msg}\n')
        # f.close()