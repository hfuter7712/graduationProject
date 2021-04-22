import os
import glob
from shutil import copy
data_folder = '../lfw/'
filenames = glob.glob(data_folder + '*')
print('fileName Output')
for i in filenames:
            picture = glob.glob(i + '/*')
            # print(picture)
            for j in picture:
                print(j)
                try:
                    copy(j, 'F:\graduationProject\Colorization-master\\face')
                except IOError as e:
                    print(e)



