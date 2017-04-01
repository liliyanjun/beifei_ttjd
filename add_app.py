#!/usr/bin/env python
# encoding: utf-8
# Date: 16/6/2 下午1:52
# file: add_app.py
# Email: fanjunwei003@163.com
# Author: 范俊伟
import os

def add_app(app_name):
    dir = "www/app/" + app_name
    dir = os.path.abspath(dir)
    print dir
    if not os.path.exists(dir):
        os.makedirs(dir)
    js_file = dir + "/" + app_name + ".js"
    f = file(js_file, 'w')
    ctrl_name = make_ctl_name(app_name)
    data = """/**
 * encoding: utf-8
 * Date: 16/6/5 15:52
 * Email: fanjunwei003@163.com
 * Author: 范俊伟
 */
    """
    f.write(data)
    data = """
app.controller('%s', function ($scope, api, modalBox, $state) {
});
    """ % ctrl_name
    f.write(data)
    f.close()
    html_file = dir + "/" + app_name + ".html"
    with open(html_file, 'w') as f:
        f.write("")


def make_ctl_name(app_name):
    app_names = app_name.split("_")

    if len(app_names) > 1:
        args = []
        args.append(app_names[0])
        for i in range(1, len(app_names)):
            sp = app_names[i]
            if sp:
                sp = sp[0].upper() + sp[1:]
                args.append(sp)
        ctrlname = ''.join(args) + "Ctrl"
    else:
        ctrlname = app_name + "Ctrl"
    return ctrlname


def create_state(app_name):
    ctrl_name = make_ctl_name(app_name)
    value = """.state('main.%s', {
            url: '/%s',
            templateUrl: "app/%s/%s.html",
            controller: "%s"
        })
    """ % (app_name, app_name, app_name, app_name, ctrl_name)
    return value

def create_script_link(app_name):
    ctrl_name = make_ctl_name(app_name)
    value = """<script src="app/%s/%s.js"></script>"""%(app_name,app_name)
    return value

names = [
    "goods_init",
]

for i in names:
    add_app(i)

stats = []
for i in names:
    stats.append(create_state(i))

print "".join(stats)

js_links = []
for i in names:
    js_links.append(create_script_link(i))

print "\n".join(js_links)
