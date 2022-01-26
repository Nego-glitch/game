from flask import Flask, render_template, request

app = Flask(__name__)


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
