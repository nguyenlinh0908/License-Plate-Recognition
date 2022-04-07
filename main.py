import cv2
#from pathlib import Path
#import argparse
import time
import sys
import json
import numpy as np
import base64
import qrcode
from PIL import Image
from pyzbar import pyzbar
from datetime import datetime
from src.lp_recognition import E2E

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])
def data_uri_to_cv2_img(uri):  
    nparr = np.fromstring(base64.b64decode(uri), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img
def create_ticket(ticket_id):
    qr = qrcode.QRCode(
        version = 1,
        box_size = 15,
        border = 5
    )
    ticketQr = {
        'id': ticket_id,
    }
    qr.add_data(json.dumps(ticketQr))
    qr.make(fit=True)
    ticket_pil = qr.make_image(fill = 'black', back_color = 'white')
    ticket_source = './tickets/'+str(ticket_id).lower() + '.png'
    ticket_pil.save(ticket_source)
    ticket_cv = cv2.imread(ticket_source)
    retval, buffer = cv2.imencode('.jpg', ticket_cv)

    ticket_base64 = base64.b64encode(buffer)
    return ticket_base64.decode('utf8'), ticket_source
def identified():
    data = read_in()
    image_64 = data['data']
    isProcess = data['process']
    if isProcess == 2:
        pathTicket = image_64
        img_convert = Image.open(pathTicket)
        qr_output = pyzbar.decode(img_convert)
        return '', qr_output, 2
    elif isProcess == 1:
        return "", image_64, 1
    else:
        img = data_uri_to_cv2_img(image_64)
        # read image

        # # start
        start = time.time()

        # # load model
        model = E2E()

        # # recognize license plate
        image = model.predict(img)
        license_plate = model.format()
        #print(license_plate) #hien ra bien so xe
        # # end
        end = time.time()
        return image, license_plate, 0

def main():
    image, content, process = identified()
    if process == 0: #nhan dien bien so
        #print('Model process on %.2f s' % (end - start))
        retval, buffer = cv2.imencode('.jpg', image)
        jpg_as_text = base64.b64encode(buffer)
        
        infoLicensePlate = {
            "base64": jpg_as_text.decode('utf8'),
            "txt": content,          
        }
        print(json.dumps(infoLicensePlate))
    elif process == 1: #xuat ve xe
        ticket, url = create_ticket(content)
        ticket_info = {
            "ticket": ticket,
            "ticket_url_sys": url         
        }
        print(json.dumps(ticket_info))
    else: #nhan nhien ve xe
        ticket_info = content[0].data
        print(json.dumps(str(ticket_info)))
    # show image
# Start process
if __name__ == '__main__':
    main()