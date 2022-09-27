from flask import Flask, jsonify, make_response, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import WorkingTime, db, User, token_required
import jwt
from datetime import datetime, timedelta, date
from config import appconfig
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(appconfig)
db.init_app(app)
cors = CORS(app)

with app.app_context():
    db.create_all()


@app.route('/register', methods=['POST'])
def signup_user():
    try:
        try:
            data = request.get_json()
            hashed_password = generate_password_hash(
                data['password'], method='sha256')
            user = User.query.filter_by(email=data['email']).first()
        except Exception as e:
            return jsonify({
                "error": "Please enter valid body"
            }), 400

        # if a user is found, we want to redirect back to
        # signup page so user can try again
        if user:
            return jsonify({"Message": " Email address already exists"}), 401

        else:
            new_user = User(email=data['email'], name=data['name'],
                            password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"Message": "User created"})
    except Exception as e:
        return jsonify({"error": e}), 500


@app.route('/login', methods=['POST'])
def login_user():
    try:
        try:
            email = request.json.get("email", None)
            password = request.json.get("password", None)
            users = User.query.filter_by(email=email).first()
        except Exception as e:
            return jsonify({
                "error": "Please enter valid body"
            }), 400

        if not users or not email or not password:
            return make_response(
                'could not verify', 401,
                {'Authentication': 'login required"'})

        if check_password_hash(users.password, password):
            token = jwt.encode(
                {'id': users.id, 'name': users.name,
                 'exp': datetime.utcnow() + timedelta(minutes=45)},
                app.config['SECRET_KEY'], "HS256")

            return jsonify({'token': token})

        return make_response(
                'could not verify', 401,
                {'Authentication': '"login required"'})
    except Exception as e:
        return jsonify({"error": e}), 500


@app.route('/starttime', methods=['POST'])
@token_required
def start_time_input(current_user):

    try:
        try:
            data = request.get_json()
            start_d = datetime.strptime(
                data['start_date'], "%Y-%m-%dT%H:%M:%S")
            resp_date = start_d.date()
            present_date = date.today()
        except Exception as e:
            return jsonify({
                "error": "Please enter valid body"
            }), 400

        time_entry = WorkingTime.query.filter_by(
                        user_id=current_user.id,
                        current_date=resp_date).first() is None

        if resp_date > present_date:
            return jsonify(
                {'message': 'Start date can not be greater ' +
                 'than present date.'})
        elif time_entry:
            new_time = WorkingTime(
                start_date=start_d, current_date=resp_date,
                user_id=current_user.id)
            db.session.add(new_time)
            db.session.commit()
            return jsonify({'message': 'Start time entry created'})
        else:
            return jsonify({'message': 'Start date already exist'})
    except Exception as e:
        return jsonify({"error": e}), 500


@app.route('/updatetime', methods=['POST'])
@token_required
def start_time_update(current_user):

    try:
        try:
            data = request.get_json()
            start_d = datetime.strptime(
                data['start_date'], "%Y-%m-%dT%H:%M:%S")
            row_id = data['id']
        except Exception as e:
            return jsonify({
                "error": "Please enter valid body"
            }), 400

        exist_update = WorkingTime.query.filter_by(
                        user_id=current_user.id, id=row_id).first()
        exist_update.start_date = start_d
        db.session.commit()
        return jsonify({'message': 'Start time updated'})
    except Exception as e:
        return jsonify({"error": e}), 500


@app.route('/endtime', methods=['POST'])
@token_required
def end_time_input(current_user):

    try:
        try:
            data = request.get_json()
            row_id = data['id']
            end_d = datetime.strptime(data['end_date'], "%Y-%m-%dT%H:%M:%S")
        except Exception as e:
            return jsonify({
                "error": "Please enter valid body"
            }), 400

        exist_update = WorkingTime.query.filter_by(
                            user_id=current_user.id, id=row_id).first()

        if exist_update is None:
            return jsonify(
                {'message': 'Start date is not available'})

        elif exist_update.start_date > end_d:
            return jsonify(
                {'message': 'End date can not be prior to start date'})

        else:
            exist_update.end_date = end_d
            db.session.commit()
            return jsonify({'message': 'End DateTime entry updated'})
    except Exception as e:
        return e


@app.route('/timesheet', methods=['GET'])
@token_required
def get_timesheet(current_user):

    try:
        logentry = WorkingTime.query.filter_by(user_id=current_user.id).all()
        output = []
        for timelog in logentry:
            timesheet = {}
            timesheet['id'] = timelog.id
            timesheet['name'] = current_user.name
            timesheet['user_id'] = timelog.user_id
            timesheet['start_date'] = timelog.start_date.strftime(
                                        "%Y-%m-%dT%H:%M:%S")
            if timelog.end_date is not None:
                timesheet['end_date'] = timelog.end_date.strftime(
                                        "%Y-%m-%dT%H:%M:%S")
                duration = (timelog.end_date-timelog.start_date)
                timesheet['duration'] = str(duration)
            else:
                timesheet['end_date'] = "NA"
                timesheet['duration'] = "NA"
            output.append(timesheet)

        return jsonify({'Timesheet': output})
    except Exception as e:
        return e
