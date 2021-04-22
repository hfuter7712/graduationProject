
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from numba import cuda
from multiprocessing import Process
import model
from config import *

import cv2
import numpy as np
import argparse


import tensorflow.compat.v1 as tf2
import tensorflow as tf

test_dir = 'test/'
test_file = 'graywt10.jpg'



# save_file = 'testp/%d.png' % (len(os.listdir('testp')) + 1)

def testMain(pic_localLa, Path, target):
    save_file = target     # 'testp/'+ str(num)+' trainingWB.png'
    total = 0
    pic_local = test_dir + pic_localLa
    # print('pic_local:', pic_local)
    img = tf.io.read_file(pic_local)
    img = tf.image.decode_image(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.image.rgb_to_yuv(img)

    try:
        gray, uv = tf.split(img, [1, 2], axis=2)
        x, y = gray.shape[0:2]
        # print('正在加载模型')
        # print(gray.shape)
        gen = model.Generator(input_shape=gray.shape)
        # print('正在加载权重')
        gen.load_weights(Path)
        # print('正在预测...')

        pred = gen(tf.expand_dims(gray, axis=0))[0]
        pred_img = tf.concat([gray, pred], axis=2)
        pred_img = tf.image.yuv_to_rgb(pred_img)
        pred_img = tf.clip_by_value(pred_img, 0., 1.)
        pred_img = tf.image.convert_image_dtype(pred_img, tf.uint8)
        pred_data = tf.image.encode_png(pred_img)

        '''
        if total != 0:
            # print('预测完成，预测文件位于' + save_file, ', 图片分辨率为', x, '*', y, '.由于显卡限制，图片经过', total, '次缩放')
        else:
          pass
            # print('预测完成，预测文件位于' + save_file, ', 图片分辨率为', x, '*', y)
            '''
        tf.io.write_file(save_file, pred_data)
        return 0, pic_localLa, x, y
    except Exception as e:
        # print(str(type(e)))
        if str(type(e)) == "<class 'tensorflow.python.framework.errors_impl.ResourceExhaustedError'>":
            total = total + 1
            # print('错误1，内存分配不足')
            # print('错误信息:', e)
            # print('正在尝试降低图片分辨率')
            # print(type(gray))
            return 1, pic_localLa, x, y
        else:
            # print('未知错误')
            # print('错误信息:', e)
            return -1, None, None, None


def test(dir, file, GenWeightPath, targetLocal, wg):
    test_dir = dir
    test_file = file
    test_local = dir + file
    test_gray = dir + 'gray' + file
    total = 0


    # tf2.disable_v2_behavior()

    # print('正在加载图片')
    # print(test_local)
    # print(type(cv2.imread(test_local, cv2.IMREAD_COLOR)))
    res = 1
    Nextlocal = ''
    width = 0
    height = 0
    if(wg=='grey_no'):
      img_resize = cv2.imread(test_local, cv2.IMREAD_COLOR).astype(np.float32) / 255.0
      img_gray = cv2.cvtColor(img_resize, cv2.COLOR_RGB2GRAY)
      img_gray = img_gray * 255
      img_gray = img_gray.astype(np.uint8)
      cv2.imwrite(test_gray, img_gray)
      curLocal = 'gray'+ test_file
    else:
      curLocal = test_file

    while res != 0:
        res, Nextlocal, width, height = testMain(curLocal, GenWeightPath, targetLocal)
        if res == 1:
            img_resize = cv2.imread(test_dir + Nextlocal, cv2.IMREAD_COLOR).astype(np.float32) / 255.0
            img_gray = cv2.resize(img_resize, (int(height / 2), int(width / 2)))
            img_gray = img_gray * 255
            img_gray = img_gray.astype(np.uint8)
            test_gray = test_dir + 'down' + Nextlocal

            cv2.imwrite(test_gray, img_gray)
            curLocal = 'down' + Nextlocal
        else:
            break
    print('{"resPicLocal":"' + args.targetlocal + '", "total":' + str(total) + ', "height":' + str(width) + ', "width":' + str(
     height) + ',"dir": "' + dir+curLocal + '"}')
    # testMain('gray'+ test_file)


parser = argparse.ArgumentParser(description='test file ex')
parser.add_argument('--picdir', default='/')
parser.add_argument('--picName', default='/')
parser.add_argument('--modellocal', default='/')
parser.add_argument('--targetlocal', default='/')
parser.add_argument('--wg', default='grey_no')

args = parser.parse_args()
# print(args)
# print(args.picdir)
# print(args.picName)
# print(args.modellocal)
# print(args.targetlocal)
# print(args.wg)
test_dir = args.picdir

test(args.picdir, args.picName, args.modellocal, args.targetlocal,args.wg)
'''
i = 0
while i <= 10000:
    GenPath = 'duringModel/GenModel(' + str(i) + ').h5'
    print('当前模型名称:', GenPath)
    test(test_dir, test_file, GenPath, i)
    i = i + 5000
'''
# test(test_dir, test_file,GenWeightPath, 0)

'''
python test.py --picdir ../tql/picture/ --picName test_1617368015472.png --modellocal ../tql/model/GenModel.h5 --targetlocal ../tql/picture/trainingWB.png  
'''


