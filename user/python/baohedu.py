import cv2
import numpy as np
import glob
from config import  *
from shutil import copy

data_folder = 'waitan/'
output_folder = 'waitanA/'
filenames = glob.glob(data_folder + '*')
outputNames = glob.glob(output_folder + '*')
print('fileName Output')
fileLength = len(filenames)
num = 1
print(filenames)
print(fileLength)
for i in filenames:
    # global num
    num = num + 1
    print(i)
    # print(len(filenames))
    # inputName = filenames[i]
    outputName = output_folder + str(num) + '.jpg'
    # print(inputName, outputName)
    image = cv2.imread(i, cv2.IMREAD_COLOR).astype(np.float32) / 255.0
    # hlsImg = ytrue.astype(np.float32) / 255.0
    hlsImg = cv2.cvtColor(image, cv2.COLOR_BGR2HLS)

    # hlsImg[:, :, 1] = (1.0 + lightness / float(MAX_VALUE)) * hlsImg[:, :, 1]
    # hlsImg[:, :, 1][hlsImg[:, :, 1] > 1] = 1
    # 饱和度
    hlsImg[:, :, 2] = (1.0 + saturation / float(MAX_VALUE)) * hlsImg[:, :, 2]
    hlsImg[:, :, 2][hlsImg[:, :, 2] > 1] = 1

    hlsImg = cv2.cvtColor(hlsImg, cv2.COLOR_HLS2BGR) * 255
    outputImage = hlsImg.astype(np.uint8)
    print(outputName)
    cv2.imwrite(outputName, outputImage)
