import cv2
#from pathlib import Path
#import argparse
import time
import sys
import json
import numpy as np
import base64
import qrcode
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
def create_ticket(license_plate):
    timeline = datetime.now().strftime('%d-%m-%Y %H:%M:%S')
    time_qr_name = datetime.now().strftime('%d_%m_%Y_%H_%M_%S')
    qr = qrcode.QRCode(
        version = 1,
        box_size = 15,
        border = 5
    )
    ticketQr = {
        'license_plate': license_plate,
        'time': timeline,
    }
    qr.add_data(json.dumps(ticketQr))
    qr.make(fit=True)
    ticket_pil = qr.make_image(fill = 'black', back_color = 'white')
    ticket_source = './tickets/'+license_plate.lower() + time_qr_name+ '.png'
    ticket_pil.save(ticket_source)
    ticket_cv = cv2.imread(ticket_source)
    retval, buffer = cv2.imencode('.jpg', ticket_cv)

    ticket_base64 = base64.b64encode(buffer)
    return ticket_base64.decode('utf8'), ticket_source
def identified():
    my_base64 = read_in()
    img = data_uri_to_cv2_img(my_base64)
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
    return image, license_plate
def main():
    image, license_plate = identified()
    #print('Model process on %.2f s' % (end - start))
    retval, buffer = cv2.imencode('.jpg', image)
    jpg_as_text = base64.b64encode(buffer)
    
    ticket, url = create_ticket(license_plate)
    infoLicensePlate = {
        "base64": jpg_as_text.decode('utf8'),
        "txt": license_plate,
        "ticket": ticket,
        "ticket_url_sys": url
    }
    print(json.dumps(infoLicensePlate))
    # show image
    # cv2.imshow('License Plate', image)
    # if cv2.waitKey(0) & 0xFF == ord('q'):
    #     exit(0)
    # cv2.destroyAllWindows()

# Start process
if __name__ == '__main__':
    main()