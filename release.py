# coding=utf-8
import datetime
import qiniu
import json
import os
import sys
import zipfile
import requests
from qiniu import Auth
from qiniu import BucketManager

__author__ = 'cc'

global_config = {
    "develop": {
        "accessKey": "_Jsy--Hfm1ldj070dRJth1a4Gx-6TkcpySMcZm3V",
        "secretKey": "Xa1r9yMQwwiGZb2GZTOV13BzDrJiY6JAXSVZ9AkJ",
        "bucket": "qn2-public-test",
        "qnDomain": "http://7xlb6t.com2.z0.glb.qiniucdn.com",
        "serverHost": "http://custom.ddbuild.cn"
    },
    "debug": {
        "accessKey": "_Jsy--Hfm1ldj070dRJth1a4Gx-6TkcpySMcZm3V",
        "secretKey": "Xa1r9yMQwwiGZb2GZTOV13BzDrJiY6JAXSVZ9AkJ",
        "bucket": "qn2-public-test",
        "qnDomain": "http://7xlb6t.com2.z0.glb.qiniucdn.com",
        "serverHost": "http://custom.ddbuild.cn"
    },
    "release": {
        "accessKey": "_Jsy--Hfm1ldj070dRJth1a4Gx-6TkcpySMcZm3V",
        "secretKey": "Xa1r9yMQwwiGZb2GZTOV13BzDrJiY6JAXSVZ9AkJ",
        "bucket": "qn2-public",
        "qnDomain": "http://7xlb6q.com2.z0.glb.qiniucdn.com",
        "serverHost": "http://ttjd.ddbuild.cn"
    },
    "emp_yangjian": {
        "accessKey": "_Jsy--Hfm1ldj070dRJth1a4Gx-6TkcpySMcZm3V",
        "secretKey": "Xa1r9yMQwwiGZb2GZTOV13BzDrJiY6JAXSVZ9AkJ",
        "bucket": "qn2-public",
        "qnDomain": "http://7xlb6q.com2.z0.glb.qiniucdn.com",
        "serverHost": "http://emp.yzceg.com"
    },
    "emp_yizixuan": {
        "accessKey": "_Jsy--Hfm1ldj070dRJth1a4Gx-6TkcpySMcZm3V",
        "secretKey": "Xa1r9yMQwwiGZb2GZTOV13BzDrJiY6JAXSVZ9AkJ",
        "bucket": "qn2-public",
        "qnDomain": "http://7xlb6q.com2.z0.glb.qiniucdn.com",
        "serverHost": "http://emp.tjeasyshare.com"
    }
}


# 解析结果
def parseRet(retData, respInfo):
    if retData != None:
        print("Upload file success!")
        print("Hash: " + retData["hash"])
        print("Key: " + retData["key"])

        # 检查扩展参数
        for k, v in retData.items():
            if k[:2] == "x:":
                print(k + ":" + v)

        # 检查其他参数
        for k, v in retData.items():
            if k[:2] == "x:" or k == "hash" or k == "key":
                continue
            else:
                print(k + ":" + str(v))
    else:
        print("Upload file failed!")
        print("Error: " + respInfo.text_body)

        # 无key上传，http请求中不指定key参数


def zip_dir(z, zip_base_dir, src_dir):
    zip_base_dir_list = zip_base_dir.replace('\\', '/').split('/')
    for parent, dirnames, filenames in os.walk(src_dir):
        parent_list = parent.replace('\\', '/').split('/')[len(zip_base_dir_list):]
        for filename in filenames:
            if filename.startswith('.'):
                continue
            key_list = parent_list + [filename]
            key = '/'.join(key_list)
            path = os.path.join(parent, filename)
            z.write(path, key)


def write_version_file(z, src_path, des_path, platform, auto_add_code, serverHost):
    file = open(src_path, 'r')
    str = file.read()
    file.close()
    obj = json.loads(str)

    if auto_add_code:
        response = requests.post(serverHost + "/phonegap/get_latest_code", data={'platform': platform})
        res = response.json()
        code = int(res.get('result', {}).get('code', 0)) + 1
        obj['code'] = max(obj['code'], code)
        print obj['code']

    str = json.dumps(obj)
    # z.writestr(des_path, str)
    z.writestr('version.json', str)
    return obj


def release_main(version_type, platform, upload, zip_name, auto_add_code=False):
    src_base_dir = os.path.abspath("www")
    zip_base_dir = src_base_dir
    src_dir = zip_base_dir
    if not zip_name:
        zip_name = "%s_%s.zip" % (version_type, platform)

    sub_base_dir = os.path.abspath("sub/%s/" % version_type)
    version_file_name = "version_%s.json" % platform
    # os.system("rm -r " + src_base_dir)
    os.system("rm -f " + zip_name)
    # os.system("ionic platform " + platform)
    # os.system("ionic prepare " + platform)
    config = global_config[version_type]
    accessKey = config['accessKey']
    secretKey = config['secretKey']
    bucket = config['bucket']
    qnDomain = config['qnDomain']
    serverHost = config['serverHost']
    try:
        import zlib
        compression = zipfile.ZIP_DEFLATED
    except:
        compression = zipfile.ZIP_STORED
    zip_filename = os.path.abspath(zip_name)  # 压缩后的文件名
    z = zipfile.ZipFile(zip_filename, mode="w", compression=compression)
    zip_dir(z, zip_base_dir, src_dir)
    version_info = write_version_file(z, os.path.join(sub_base_dir, version_file_name), version_file_name, platform,
                                      auto_add_code,
                                      serverHost)

    # 覆盖分支配置
    src_dir = os.path.join(sub_base_dir, 'www')
    zip_dir(z, src_dir, src_dir)
    sub_base_dir = os.path.abspath("sub/%s-%s/" % (version_type, platform))
    if os.path.exists(sub_base_dir):
        print src_dir
        src_dir = os.path.join(sub_base_dir, 'www')
        zip_dir(z, src_dir, src_dir)
    z.close()
    print '======================='
    print 'zip name:%s' % zip_name
    if upload:
        # 上传文件
        auth = qiniu.Auth(accessKey, secretKey)
        upToken = auth.upload_token(bucket)
        # 设置上传后文件名
        now = datetime.datetime.now()
        key = "phonegap/www_%s_%s.zip" % (platform, now.strftime("%Y%m%d%H%M%S"))
        print "%s uploading ..." % key
        retData, respInfo = qiniu.put_file(upToken, key, zip_filename)
        # 解析结果
        parseRet(retData, respInfo)
        # 保存版本信息

        version = version_info["version"]
        code = version_info["code"]
        desc = version_info["desc"]
        min_native_version = version_info["min_native_version"]
        qiniuUrl = qnDomain + '/' + key
        port = "phonegap/save_phonegap_version"
        urlPort = serverHost + "/" + port
        q = Auth(accessKey, secretKey)
        bucket_info = BucketManager(q)
        ret, info = bucket_info.stat(bucket, key)
        file_size = ret["fsize"]
        info = {
            "version": version,
            "code": code,
            "desc": desc,
            "url": qiniuUrl,
            "platform": platform,
            "file_size": file_size,
            "min_native_version": min_native_version,
        }
        # 发送请求保存版本信息
        r = requests.post(urlPort, data=info)
        try:
            jres = r.json()
            if jres.get('success'):
                print 'release success'
            else:
                print jres.get('message')
        except:
            print r.text


if __name__ == "__main__":

    version_type = None
    platform = None
    upload = None
    zip_name = None

    while version_type != "0" and version_type != "1":
        version_type = raw_input("version type 0:debug,1:release] [0] :") or "0"

    while not upload in ["0", "1"]:
        upload = raw_input("dose upload? 0:No 1:Yes [1]:") or "1"

    while platform != "0" and platform != "1":
        platform = raw_input("platform 0:android 1:ios :")

    if version_type == '0':
        version_type = "debug"
    elif version_type == '1':
        version_type = "release"

    if platform == '0':
        platform = "android"
    elif platform == '1':
        platform = "ios"

    upload = upload == '1'
    release_main(version_type, platform, upload, zip_name)
