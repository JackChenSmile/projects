import os
from operator import and_

from flask import Blueprint, render_template, request, session, jsonify

from home.models import User, House, Area, HouseImage, Facility, Order
from utils.functions import is_login
from utils.settings import MEDIA_PATH

home = Blueprint('home', __name__)

@home.route('/index/')
def index():
    return render_template('index.html')


@home.route('/index_top/', methods=['GET'])
def index_top():
    if request.method == 'GET':
        user_id = session.get('user_id')
        house_list = House.query.all()
        house = []
        for i in house_list:
            house.append(i.to_dict())
        if (user_id):
            user = User.query.filter(User.id == user_id).first().to_basic_dict()
            return jsonify({'user_id': user_id, 'user': user, 'house': house})
        return jsonify({'house': house})


@home.route('/index_area/', methods=['GET'])
def index_area():
    if request.method == 'GET':
        area_list = Area.query.all()
        area = []
        for i in area_list:
            area.append(i.to_dict())
        return jsonify({'area': area})


@home.route('/detail/<int:id>/', methods=['GET', 'POST'])
@is_login
def detail(id):
    if request.method == 'GET':
        return render_template('detail.html')
    if request.method == 'POST':
        user_id = session.get('user_id')
        house = House.query.filter(House.id == id).first()
        user = User.query.filter(User.id == user_id).first()
        booking_id = house.user_id
        house = house.to_full_dict()
        user = user.to_basic_dict()
        return jsonify({'code': 200, 'user': user, 'house': house, 'booking_id': booking_id})


@home.route('/myhouse/', methods=['GET', 'POST'])
def myhouse():
    if request.method == 'GET':
        return render_template('myhouse.html')
    if request.method == 'POST':
        user_id = session.get('user_id')
        house_list = House.query.filter(House.user_id == user_id).all()
        house = []
        for i in house_list:
            house.append(i.to_dict())
        return jsonify({'code': 200, 'house': house})


@home.route('/area/', methods=['GET', 'POST'])
def area():
    area = Area.query.all()
    len = []
    for i in area:
        len.append(i.name)
    return jsonify({'code': 200, 'len': len})


@home.route('/image/', methods=['GET', 'POST', 'PATCH'])
def image():
    if request.method == 'GET':
        return render_template('myhouse.html')
    if request.method == 'POST':
        image_house = HouseImage()
        image = request.files.get('house_image')
        path = os.path.join(MEDIA_PATH, image.filename)
        image.save(path)
        house_id = session.get('house_id')
        house = House.query.filter(House.id == house_id).first()
        # 通过image查询house对象
        image_house.house = house
        image_house.url = image.filename
        house.index_image_url = image.filename
        image_house.add_update()
        return jsonify({'code': 200, 'msg': '请求成功', 'image': image.filename})


@home.route('/newhouse/', methods=['GET', 'POST'])
def newhouse():
    if request.method == 'GET':
        return render_template('newhouse.html')
    if request.method == 'POST':
        title = request.form.get('title')
        price = request.form.get('price')
        area_id = request.form.get('area_id')
        address = request.form.get('address')
        room_count = request.form.get('room_count')
        acreage = request.form.get('acreage')
        unit = request.form.get('unit')
        capacity = request.form.get('capacity')
        beds = request.form.get('beds')
        deposit = request.form.get('deposit')
        min_days = request.form.get('min_days')
        max_days = request.form.get('max_days')
        user_id = session.get('user_id')
        # get_list取到所有设备的value值，组成一个列表
        facility_list = request.form.getlist('facility')
        facility = [Facility.query.filter(Facility.id == int(i)).first() for i in facility_list]
        house = House()
        house.user_id = user_id
        house.title = title
        house.price = price
        house.area_id = area_id
        house.address = address
        house.room_count = room_count
        house.acreage = acreage
        house.unit = unit
        house.capacity = capacity
        house.beds = beds
        house.deposit = deposit
        house.min_days = min_days
        house.max_days = max_days
        house.facilities = facility
        house.add_update()
        session['house_id'] = house.id
        return jsonify({'code': 200})


@home.route('/search/', methods=['GET', 'POST'])
def search():
    if request.method == 'GET':
        return render_template('search.html')
    if request.method == 'POST':
        pass


@home.route('/search_area/', methods=['GET'])
def search_area():
    if request.method == 'GET':
        area_list = Area.query.all()
        area = []
        for i in area_list:
            area.append(i.to_dict())
        return jsonify({'area': area})


# @home.route('/search_time/', methods=['GET', 'POST'])
# def search_time():
#     if request.method == 'POST':
#         aid = request.form.get('aid')
#         endDate = request.form.get('endDate')
#         startDate = request.form.get('startDate')
#         order1 = Order.query.filter(and_(Order.begin_date < startDate, Order.end_date < endDate)).all()
#         order2 = Order.query.filter(and_(Order.begin_date > startDate, Order.end_date < endDate)).all()
#         order3 = Order.query.filter(and_(Order.begin_date > startDate, Order.end_date > endDate)).all()
#         order4 = Order.query.filter(and_(Order.begin_date < startDate, Order.end_date > endDate)).all()
#         orders = list(set(order1 + order2 + order3 + order4))
#         house_list = House.query.all()
#         house = []
#         for i in house_list:
#             house.append(i.to_full_dict())
#         return jsonify({'house': house})


@home.route('/search_all_house/', methods=['GET', 'POST'])
def search_all_house():
    if request.method == 'GET':
        house_list = House.query.all()
        house = []
        for i in house_list:
            house.append(i.to_full_dict())
        return jsonify({'house': house})
    if request.method == 'POST':
        endDate = request.form.get('endDate')
        startDate = request.form.get('startDate')
        aid = request.form.get('aid')
        # 筛选区域的房子
        house_list = House.query.filter(House.area_id == aid)
        # 筛选房屋对象
        # 订单中的入住时间 < 筛选的入住时间，订单中的离开时间 < 筛选的离开时间
        order1 = Order.query.filter(and_(Order.begin_date<startDate, Order.end_date<endDate)).all()
        # 订单中的入住时间 > 筛选的入住时间，订单中的离开时间 < 筛选的离开时间
        order2 = Order.query.filter(and_(Order.begin_date>startDate, Order.end_date<endDate)).all()
        # 订单中的入住时间 > 筛选的入住时间，订单中的离开时间 > 筛选的离开时间
        order3 = Order.query.filter(and_(Order.begin_date>startDate, Order.end_date>endDate)).all()
        # 订单中的入住时间 < 筛选的入住时间，订单中的离开时间 > 筛选的离开时间
        order4 = Order.query.filter(and_(Order.begin_date<startDate, Order.end_date>endDate)).all()
        orders = list(set(order1 + order2 + order3 + order4))
        order = []
        for i in orders:
            order.append(i.house_id)
        house = []
        for i in house_list:
            if i.id not in order:
                house.append(i.to_full_dict())
        return jsonify({'house': house})
