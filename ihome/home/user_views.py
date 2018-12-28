import os
import random
import re

from flask import request, render_template, Blueprint, jsonify, session

from home.models import User
from utils import status_code
from utils.functions import is_login
from utils.settings import MEDIA_PATH

user = Blueprint('user', __name__)

@user.route('/random_code/', methods=['GET', 'POST'])
def random_code():
    str = '234567890qwertyuiopasdfghjkl'
    num_code = ''
    for _ in range(4):
        num_code += random.choice(str)
    return jsonify({'code': 200, 'num_code': num_code})


@user.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    if request.method == 'POST':
        mobile = request.form.get('mobile')
        password = request.form.get('password')
        if not all([mobile, password]):
            return jsonify(status_code.USER_PARAMS_IS_INVALID)
        user = User.query.filter(User.phone==mobile).first()
        if not user:
            return jsonify(status_code.USER_NOT_REGISTER)
        if not user.check_pwd(password):
            return jsonify(status_code.PASSWORD_ERROR)
        session['user_id'] = user.id
        return jsonify({'code': 200, 'msg': '登陆成功'})


@user.route('/logout/', methods=['GET', 'POST'])
def logout():
    session.clear()
    return jsonify({'code': 200, 'msg': '请求成功'})



@user.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    if request.method == 'POST':
        mobile = request.form.get('mobile')
        password = request.form.get('password')
        password2 = request.form.get('password2')
        user = User.query.filter(User.phone == mobile).first()
        ret = re.match(r"^1[35678]\d{9}$", mobile)
        if user:
            return jsonify(status_code.USER_REGISTER)
        if not ret:
            return jsonify(status_code.USER_NOT_PHONE)
        if password != password2:
            return jsonify(status_code.PASSWORD_DOUBLE_ERROR)
        host = User()
        host.phone = mobile
        host.password = password
        host.add_update()
        return jsonify({'code': 200, 'msg': '注册成功'})


@user.route('/auth/', methods=['GET', 'POST'])
def auth():
    if request.method == 'GET':
        return render_template('auth.html')
    if request.method == 'POST':
        real_name = request.form.get('real_name')
        id_card = request.form.get('id_card')
        check_name = re.match(r'^[\u4e00-\u9fa5]{1,8}$', real_name)
        check_id = re.match(r'\d{6}(19\d{2}|200\d|201[0-8])(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[01])\d{3}[\dxX]', id_card)
        if not all([real_name, id_card]):
            return jsonify(status_code.USER_PARAMS_IS_INVALID)
        if not check_name:
            return jsonify(status_code.USER_NOT_NAME)
        if not check_id:
            return jsonify(status_code.USER_NOT_ID)
        user = User.query.filter(User.id_card == check_id).first()
        if user:
            return jsonify(status_code.USER_IS_ID)
        user_id = session.get('user_id')
        user = User.query.filter(User.id == user_id).first()
        user.id_name = real_name
        user.id_card = id_card
        user.add_update()
        return jsonify({'code': 200, 'msg': '请求成功'})


@user.route('/real_auth/', methods=['GET', 'POST'])
def real_auth():
    user_id = session.get('user_id')
    user = User.query.filter(User.id == user_id).first()
    return jsonify({'id_name': user.id_name, 'id_card': user.id_card})


@user.route('/profile/', methods=['GET', 'POST'])
def profile():
    if request.method == 'GET':
        return render_template('profile.html')
    if request.method == 'POST':
        avatar = request.files.get('avatar')
        name = request.form.get('name')
        user_id = session.get('user_id')
        user = User.query.filter(User.id == user_id).first()
        if avatar:
            path = os.path.join(MEDIA_PATH, avatar.filename)
            avatar.save(path)
            user.avatar = avatar.filename
        if name:
            user.name = name
        user.add_update()
        return jsonify({'code': 200, 'msg': '请求成功'})


@user.route('/my/', methods=['GET', 'POST'])
@is_login
def my():
    if request.method == 'GET':
        return render_template('my.html')
    if request.method == 'POST':
        user_id = session.get('user_id')
        user = User.query.filter(User.id == user_id).first()
    return jsonify({'code': 200,'avatar': user.avatar, 'name': user.name, 'msg': '请求成功', 'phone': user.phone})
