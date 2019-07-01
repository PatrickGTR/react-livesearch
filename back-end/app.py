from flask import (
    Flask,
    jsonify
)

from flask_cors import CORS

import pymysql


app = Flask(__name__)
CORS(app)

@app.route('/users/<username>', methods=["GET"])
def users(username):


    conn = pymysql.connect(
        host="",
        user="root",
        passwd="",
        db="cnr",
        autocommit=True,
        cursorclass=pymysql.cursors.DictCursor
    )

    try:
        with conn.cursor() as cursor:
            # Read a single record
            query = "SELECT username, accountID, kills, deaths, score FROM accounts WHERE username LIKE %s"
            param = f"%{username}%"
            cursor.execute(query, param)
            result = cursor.fetchall()
    finally:
        conn.close()

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)