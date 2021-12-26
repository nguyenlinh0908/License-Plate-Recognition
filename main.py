import cv2
#from pathlib import Path
#import argparse
import time
import sys, json
import numpy as np
import base64
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
def main():
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

    #print('Model process on %.2f s' % (end - start))
    retval, buffer = cv2.imencode('.jpg', image)
    jpg_as_text = base64.b64encode(buffer)
  #  cv2.imwrite('testfile.jpg', image)
    print(jpg_as_text)
    # show image
    # cv2.imshow('License Plate', image)
    # if cv2.waitKey(0) & 0xFF == ord('q'):
    #     exit(0)
    # cv2.destroyAllWindows()

# Start process
if __name__ == '__main__':
    main()