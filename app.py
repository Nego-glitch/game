from flask import Flask, render_template, request

import mysql.connector

app = Flask(__name__)
app.config["DEBUG"] = True
scores = []


@app.route('/')
def blank():
    return render_template('index.html')


@app.route('/calculator', methods=["GET", "POST"])
def calculator():
    if request.method == "POST":
        var1 = int(request.form["Variable1"])
        var2 = int(request.form["Variable2"])
        result = var1 * var2
        print(var1)
        print(var2)
        print(result)
        return render_template('calc.html', sum=result, var1=var1, var2=var2)
    return render_template('calc.html', sum=" ", var1=" ", var2=" ")


@app.route('/guessinggame', methods=["GET", "POST"])
def guessinggame():
    if request.method == "GET":
        return render_template('guessing_game.html')
    return render_template('guessing_game.html')


@app.route('/guessinggame/scoreboard', methods=["GET", "POST"])
def scoreboard():
    showInputs = True
    mydb = mysql.connector.connect(
        host="localhost",
        user="Negone",
        passwd="py1h0nAnywh3re",
        database="gg"
    )
    mycursor = mydb.cursor(buffered=True)

    query = "select Username, Points from scoreboard order by Points"

    if request.method == "GET":
        mycursor.execute(query)
        points = mycursor.fetchall()

        return render_template('scoreboard.html', points=points, showInputs=True)

    values = (request.form["username"], request.form["points"])
    sql = "INSERT INTO scoreboard (Username, Points) VALUES (%s,%s)"
    mycursor.execute(sql, values)
    mydb.commit()

    mycursor.execute(query)
    points = mycursor.fetchall()
    return render_template('scoreboard.html', points=points, showInputs=False)
