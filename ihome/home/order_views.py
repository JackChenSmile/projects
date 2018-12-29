from flask import Blueprint, request, render_template, jsonify, session

from home.models import House, Order
from utils.functions import is_login
from datetime import datetime

order = Blueprint('order', __name__)


@order.route('/booking/<int:id>/', methods=['GET', 'POST'])
def booking(id):
    if request.method == 'GET':
        return render_template('booking.html')
    if request.method == 'POST':
        user_id = session.get('user_id')
        house = House.query.filter(House.id == id).first()
        start_date = datetime.strptime(request.form.get('start_date'), '%Y-%m-%d')
        end_date = datetime.strptime(request.form.get('start_date'), '%Y-%m-%d')
        amount = request.form.get('amount')
        days = request.form.get('days')
        order = Order()
        order.house_id = id
        order.user_id = user_id
        order.house_price = house.price
        order.begin_date = start_date
        order.end_date = end_date
        order.amount = amount
        order.days = days
        house.order_count += 1
        order.add_update()
        return jsonify({'code': 200})


@order.route('/refresh/<int:id>/', methods=['GET', 'POST'])
def refresh(id):
    if request.method == 'POST':
        house = House.query.filter(House.id == id).first()
        house = house.to_full_dict()
        return jsonify({'code': 200, 'house': house})


@order.route('/lorders/', methods=['GET', 'POST'])
@is_login
def lorders():
    if request.method == 'GET':
        return render_template('lorders.html')
    if request.method == 'POST':
        pass


@order.route('/orders/', methods=['GET', 'POST'])
@is_login
def orders():
    if request.method == 'GET':
        return render_template('orders.html')
    if request.method == 'POST':
        value = request.form.get('value')
        order_id = request.form.get('order_id')
        order = Order.query.filter(Order.id == order_id).first()
        order.comment = value
        order.add_update()
        return jsonify({'code': 200, 'value': value})


@order.route('/order_id/', methods=['GET', 'POST'])
def order_id():
    if request.method == 'GET':
        user_id = session.get('user_id')
        order_list = Order.query.filter(Order.user_id == user_id).all()
        order = []
        for i in order_list:
            order.append(i.to_dict())
        return jsonify({'order': order})


@order.route('/client/', methods=['GET', 'POST'])
def client():
    if request.method == 'GET':
        user_id = session.get('user_id')
        house_list = House.query.filter(House.user_id == user_id).all()
        orders = []
        for house in house_list:
            order = Order.query.filter(Order.house_id == house.id).all()
            orders += order
        print(orders)
        order = []
        for i in orders:
            order.append(i.to_dict())
        order.sort(key=lambda x:x['order_id'])
        return jsonify({'order': order})
