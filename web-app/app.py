from flask import Flask, render_template
import csv
app = Flask(__name__)

@app.route('/')
def home():
    """Loads and returns the home page. """
    return(render_template('homepage.html'))


@app.route("/stats")
def stats():
    """Loads and returns the statistic of individual countries around the world page."""
    allCountries = []
    count = 186
    # reads the csv file to get a list of all countries.
    with open("web-app/static/data/countries-aggregated.csv", newline="") as csvfile:
        content = csv.reader(csvfile,delimiter=",")
        for row in content:
            if (count != 0):
                allCountries.append(row[1])
                count-=1;
    # removes the column name to only have a list of all countries.
    allCountries.pop(0)
    return(render_template("stats.html", allCountries = allCountries))

@app.route("/compare")
def compare():
    """Loads and returns the compare page which compares statistics of two chosen countries."""
    allCountries = []
    count = 186
    # reads the csv file to get a list of all countries.
    with open("web-app/static/data/countries-aggregated.csv", newline="") as csvfile:
        content = csv.reader(csvfile,delimiter=",")
        for row in content:
            if (count != 0):
                allCountries.append(row[1])
                count-=1;
    # removes the column name to only have a list of all countries.
    allCountries.pop(0)
    return(render_template("compare.html", allCountries = allCountries))

if __name__ == "__main__":
    app.debug=True
    app.run()
