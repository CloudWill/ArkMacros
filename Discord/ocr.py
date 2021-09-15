from __future__ import print_function
import requests
import socket
import os


def post_image(img_file):
    hostname = socket.gethostname()
    ip_addr = socket.gethostbyname(hostname)

    """ post image and return the response """
    # prepare headers for http request
    # content_type = 'image/png'
    # headers = {'content-type': content_type}
    addr = 'http://localhost:3004/catalog'
    url = addr + '/api/files/send_tribe_image'
    # print(url)
    data = {"file": open(img_file, 'rb').read(),
            'file_name': img_file}
    # response = requests.post(url, data=data, headers=headers)
    # return response
    print(url)
    files = {
        'file': (f'{ip_addr}-{img_file}', open(img_file,'rb'), 'image/png')}
    r = requests.post(url, files=files)
    print(r.reason)
    # r = requests.post(url, data=data, mimetype='image/png')
    # print(r.reason)


print(post_image("1.png"))

# expected output: {u'message': u'image received. size=124x124'}
