from flask import Flask, render_template
import csv
app = Flask(__name__)

@app.route('/')
def home():
    return(render_template('homepage.html'))


@app.route("/stats")
def stats():
    allCountries = []
    count = 186
    with open("static/data/countries-aggregated.csv", newline="") as csvfile:
        content = csv.reader(csvfile,delimiter=",")
        for row in content:
            if (count != 0):
                allCountries.append(row[1])
                count-=1;
    allCountries.pop(0)
    return(render_template("stats.html", allCountries = allCountries))

@app.route("/compare")
def compare():
    allCountries = []
    count = 186
    with open("static/data/countries-aggregated.csv", newline="") as csvfile:
        content = csv.reader(csvfile,delimiter=",")
        for row in content:
            if (count != 0):
                allCountries.append(row[1])
                count-=1;
    allCountries.pop(0)
    return(render_template("compare.html", allCountries = allCountries))

if __name__ == "__main__":
    app.debug=True
    app.run()
